"""Small same-origin fallbacks for automatic prayer location and schedules."""

import hashlib
import ipaddress
import json
import re
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen

from django.core.cache import cache
from django.http import JsonResponse
from django.views.decorators.http import require_GET


def _public_client_ip(request):
    # Nginx supplies X-Real-IP. Forwarded headers are only used for location,
    # never for authentication, and every candidate is parsed before use.
    candidates = [
        request.META.get('HTTP_CF_CONNECTING_IP', ''),
        request.META.get('HTTP_X_REAL_IP', ''),
        request.META.get('HTTP_X_FORWARDED_FOR', '').split(',')[0].strip(),
        request.META.get('REMOTE_ADDR', ''),
    ]
    for candidate in candidates:
        try:
            address = ipaddress.ip_address(candidate)
            if address.is_global:
                return str(address)
        except ValueError:
            continue
    return None


def _read_json(url):
    request = Request(url, headers={
        'Accept': 'application/json',
        'User-Agent': 'MaktabaTulMuslim-PrayerTimes/1.0 (https://maktabatulmuslim.com)',
    })
    with urlopen(request, timeout=5) as response:
        return json.load(response)


def _normalise_ip_location(data):
    if data.get('success') is False or data.get('error'):
        return None
    geo = data.get('geoLocation') or data
    try:
        lat = float(geo.get('latitude'))
        lng = float(geo.get('longitude'))
    except (TypeError, ValueError):
        return None
    if not -90 <= lat <= 90 or not -180 <= lng <= 180:
        return None
    city = geo.get('city') or geo.get('region') or ''
    country = geo.get('country_name') or geo.get('country') or ''
    timezone = data.get('timezone') or ''
    if isinstance(timezone, dict):
        timezone = timezone.get('id') or timezone.get('time_zone') or ''
    if not city or not country or not timezone:
        return None
    return {
        'type': 'ip', 'lat': lat, 'lng': lng, 'city': city,
        'country': country, 'countryCode': geo.get('country_code') or geo.get('countryCode') or '',
        'timezone': timezone, 'label': f'{city}, {country}',
    }


@require_GET
def api_prayer_location(request):
    ip = _public_client_ip(request)
    if not ip:
        return JsonResponse({'error': 'Public visitor address unavailable.'}, status=503)
    key = 'prayer_location_' + hashlib.sha256(ip.encode()).hexdigest()
    cached = cache.get(key)
    if cached:
        return JsonResponse(cached)
    for url in (f'https://ipapi.co/{quote(ip)}/json/', f'https://ipwho.is/{quote(ip)}'):
        try:
            location = _normalise_ip_location(_read_json(url))
            if location:
                cache.set(key, location, 12 * 60 * 60)
                response = JsonResponse(location)
                response['Cache-Control'] = 'private, max-age=3600'
                return response
        except (OSError, ValueError, json.JSONDecodeError):
            continue
    return JsonResponse({'error': 'Automatic location temporarily unavailable.'}, status=503)


@require_GET
def api_prayer_proxy(request, resource):
    # Only the two daily and two monthly prayer endpoints are reachable here.
    if not re.fullmatch(r'(?:timings|timingsByCity)/\d{2}-\d{2}-\d{4}|(?:calendar|calendarByCity)/\d{4}/\d{1,2}', resource):
        return JsonResponse({'error': 'Invalid prayer resource.'}, status=400)
    allowed = {'latitude', 'longitude', 'city', 'country', 'method', 'school'}
    params = {key: value[:100] for key, value in request.GET.items() if key in allowed}
    if 'ByCity' in resource:
        if not params.get('city') or not params.get('country'):
            return JsonResponse({'error': 'City and country required.'}, status=400)
    else:
        try:
            lat, lng = float(params['latitude']), float(params['longitude'])
            if not -90 <= lat <= 90 or not -180 <= lng <= 180:
                raise ValueError
        except (KeyError, ValueError):
            return JsonResponse({'error': 'Valid coordinates required.'}, status=400)
    url = f'https://api.aladhan.com/v1/{resource}?{urlencode(params)}'
    key = 'prayer_data_' + hashlib.sha256(url.encode()).hexdigest()
    payload = cache.get(key)
    if payload is None:
        try:
            payload = _read_json(url)
        except (OSError, ValueError, json.JSONDecodeError):
            return JsonResponse({'error': 'Prayer service temporarily unavailable.'}, status=503)
        if payload.get('code') != 200 or not payload.get('data'):
            return JsonResponse({'error': 'Prayer service returned no schedule.'}, status=502)
        cache.set(key, payload, 30 * 60)
    return JsonResponse(payload)
