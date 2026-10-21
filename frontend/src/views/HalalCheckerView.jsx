import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, ShieldCheck, AlertTriangle, XCircle, CheckCircle, 
  HelpCircle, Info, Filter, Sparkles, BookOpen, ExternalLink, RefreshCw 
} from 'lucide-react';

// Comprehensive Shariah E-Codes & Food Ingredients Database
const E_CODES_DATABASE = [
  // --- HARAM CODES (حرام) ---
  {
    code: "E120",
    nameEn: "Carmine / Cochineal / Carminic Acid",
    nameUr: "کارمائن / سرخ کیڑے کا رنگ (کوچینیئل)",
    nameAr: "الكارمين / حمض الكارمينيك (صبغة الدودة القرمزية)",
    status: "haram",
    category: "Colors",
    source: "Insects (Crushed Cochineal beetles / حشرات)",
    rulingEn: "Haram according to majority Hanafi jurisprudence and major Halal bodies because it is extracted by boiling and crushing female cochineal insects.",
    rulingUr: "فقہ حنفی اور اکثر جمہور فقہاء کے نزدیک حرام ہے کیونکہ یہ سرخ کیڑوں (کوچینیئل) کو پیس کر بنایا جاتا ہے۔",
    rulingAr: "محرم عند جمهور الفقهاء والحنفية لأنه مستخرج من سحق حشرة الدودة القرمزية المجففة.",
    commonIn: "Red candies, strawberry yogurt, cosmetics, juices, pastries, processed meat."
  },
  {
    code: "E441",
    nameEn: "Gelatine / Gelatin (Uncertified)",
    nameUr: "جیلیٹن (غیر تصدیق شدہ)",
    nameAr: "الجيلاتين (غير المعتمد)",
    status: "haram",
    category: "Thickeners & Gelling",
    source: "Pork skins/bones or non-dhabihah cattle (خنزیر یا غیر ذبیحہ جانور)",
    rulingEn: "Haram unless explicitly certified Halal (from 100% Halal-slaughtered bovine or fish). Commercial European/US gelatin is mostly pork-derived.",
    rulingUr: "اگر حلال تصدیق شدہ (ذبیحہ گائے یا مچھلی) سے نہ ہو تو حرام ہے، کیونکہ یورپی و مغربی ممالک میں عموماً خنزیر کی کھال اور ہڈیوں سے بنتا ہے۔",
    rulingAr: "محرم إذا كان من مصدر خنزيري أو حيوان غير مذكى شرعاً، وهو الغالب في المنتجات الغربية ما لم ينص على أنه حلال.",
    commonIn: "Marshmallows, gummy bears, jelly, capsule shells, mousses, cheesecakes."
  },
  {
    code: "E542",
    nameEn: "Bone Phosphate (Edible Bone Phosphate)",
    nameUr: "ہڈیوں کا فاسفیٹ (بون فاسفیٹ)",
    nameAr: "فوسفات العظام الصالح للأكل",
    status: "haram",
    category: "Anti-caking Agents",
    source: "Animal Bones (Non-dhabihah / خنزیر یا مردار جانور کی ہڈیاں)",
    rulingEn: "Haram. Extracted from bones of cattle and pigs slaughtered without Islamic Shariah requirements.",
    rulingUr: "حرام ہے۔ غیر شرعی طریقہ پر ذبح شدہ یا حرام جانوروں کی ہڈیوں سے نکالا جاتا ہے۔",
    rulingAr: "حرام، مشتق من عظام الحيوانات غير المذكاة شرعاً أو الخنزير.",
    commonIn: "Powdered dry mixes, dietary supplements, toothpastes."
  },
  {
    code: "E904",
    nameEn: "Shellac",
    nameUr: "شیلیک (لاکھ / رال)",
    nameAr: "شيلاك (صمغ اللك)",
    status: "mushbooh",
    category: "Glazing Agents",
    source: "Secretions of the Lac insect (کیڑے کی رطوبت)",
    rulingEn: "Mushbooh (Disputed). Allowed by some scholars as resin secretion, but deemed Makruh/impermissible by stricter Halal authorities due to insect body remnants.",
    rulingUr: "مشکوک و اختلافی۔ بعض علماء کے نزدیک یہ محض کیڑے کی رطوبت ہے، جبکہ معتبر حلال اداروں کے نزدیک کیڑوں کے اجزاء شامل ہونے کے باعث اجتناب لازم ہے۔",
    rulingAr: "مشبوه وفيه خلاف معاصر؛ رخص فيه البعض واجتنبه آخرون لوجود أجزاء حشرية به.",
    commonIn: "Shiny coating on chocolates, fruit glazing, confectioneries, vitamin tablets."
  },
  {
    code: "E920",
    nameEn: "L-Cysteine Hydrochloride",
    nameUr: "ایل سسٹین (آٹے کا کنڈیشنر)",
    nameAr: "إل-سيستئين (محسن الخبز)",
    status: "mushbooh",
    category: "Flour Treatment Agents",
    source: "Human hair, duck feathers, or synthetic (انسانی بال، بطخ کے پر یا کیمیائی)",
    rulingEn: "Haram if derived from human hair (prohibited in Islam) or non-halal animal feathers. Halal ONLY if labeled 100% synthetic or microbial.",
    rulingUr: "اگر انسانی بالوں (جو شرعاً حرام ہے) یا غیر حلال پرندوں سے ہو تو حرام ہے۔ صرف مصنوعی یا بیکٹیریل ماخذ ہونے کی صورت میں حلال ہے۔",
    rulingAr: "محرم قطعاً إن كان من شعر الإنسان، ومشتبه إن كان من ريش الطيور، وحلال إن كان مصنعاً كيميائياً.",
    commonIn: "Commercial bread, pizza crust, bagels, flour-based bakery items."
  },

  // --- MUSHBOOH CODES (مشکوک - ماخذ پر منحصر) ---
  {
    code: "E471",
    nameEn: "Mono- and Di-glycerides of Fatty Acids",
    nameUr: "مونو اور ڈائی گلیسرائیڈز (ای-471)",
    nameAr: "أحادي وثنائي الجليسريد للأحماض الدهنية",
    status: "mushbooh",
    category: "Emulsifiers",
    source: "Plant oils (Soy/Palm) or Animal fats (Pork/Beef)",
    rulingEn: "Mushbooh. If derived from 100% vegetable oils (Soy, Palm) or Halal beef, it is Halal. If from pork or generic animal fat, it is strictly Haram. Look for 'Vegetarian' / 'Halal' logo.",
    rulingUr: "مشکوک (تفصیل طلب)۔ اگر پودوں (پام آئل یا سویا) سے ہو تو حلال ہے، لیکن اگر جانور یا خنزیر کی چربی سے ہو تو حرام ہے۔ پیکٹ پر ویجیٹیرین یا حلال کا نشان دیکھیں۔",
    rulingAr: "مشبوه؛ حلال إذا كان من أصل نباتي (نخيل/صويا)، ومحرم إذا كان من دهن الخنزير أو حيوان غير مذكى.",
    commonIn: "Breads, margarine, ice cream, chocolates, cake mixes, mayonnaise."
  },
  {
    code: "E472",
    nameEn: "Esters of Mono- and Diglycerides (E472a-f)",
    nameUr: "ایسٹرز مونو اور ڈائی گلیسرائیڈز",
    nameAr: "إسترات أحادي وثنائي الجليسريد",
    status: "mushbooh",
    category: "Emulsifiers",
    source: "Plant fatty acids or Animal fats",
    rulingEn: "Mushbooh. Can be made from vegetable oils or pork/animal fats. Needs Halal certification or 'Suitable for Vegetarians' statement.",
    rulingUr: "مشکوک۔ نباتی تیل سے ہو تو حلال، جانوروں کی چربی سے ہو تو حرام۔ حلال تصدیق یا ویجیٹیرین کا لیبل لازمی ہے۔",
    rulingAr: "مشبوه، يتطلب التحقق من كونه من مصدر نباتي خالص أو يحمل شعار الحلال.",
    commonIn: "Croissants, sliced bread, biscuits, coffee creamers."
  },
  {
    code: "E422",
    nameEn: "Glycerol / Glycerin",
    nameUr: "گلیسرین / گلیسرول",
    nameAr: "الجلسرين / الجليسرول",
    status: "mushbooh",
    category: "Humectants & Sweeteners",
    source: "Vegetable oil, petroleum, or animal fats",
    rulingEn: "Mushbooh. Halal if 100% vegetable glycerin or synthetic. Haram if derived from pork or dead animal lard.",
    rulingUr: "مشکوک۔ اگر نباتی (ویجیٹیبل) ہو تو حلال ہے، ورنہ حرام چربی سے بننے کی صورت میں ناپائیدار و ناجائز ہے۔",
    rulingAr: "مشبوه؛ مباح إذا كان جليسرين نباتي خالص أو بترولي، ومحرم إذا استخرج من شحوم محرمة.",
    commonIn: "Syrups, soft drinks, baked goods, protein bars, candies, toothpaste."
  },
  {
    code: "E481",
    nameEn: "Sodium Stearoyl-2-Lactylate",
    nameUr: "سوڈیم اسٹیرائل لیکٹیلیٹ",
    nameAr: "ستيارويل-2-لاكتيلات الصوديوم",
    status: "mushbooh",
    category: "Emulsifiers",
    source: "Stearic acid (Plant or Animal based)",
    rulingEn: "Mushbooh. Stearic acid can be synthesized from plant oils or pork tallow. Verify source.",
    rulingUr: "مشکوک۔ اسٹیرک ایسڈ پودوں سے بھی بنتا ہے اور خنزیر/جانور کی چربی سے بھی۔ ماخذ چیک کرنا ضروری ہے۔",
    rulingAr: "مشبوه لاحتمال استخدام حمض الستياريك من دهون حيوانية محرمة.",
    commonIn: "Bread, tortillas, pancake mixes, cookies."
  },
  {
    code: "E160a",
    nameEn: "Beta-Carotene (Carrier check)",
    nameUr: "بیٹا کیروٹین (خام قدرتی رنگ)",
    nameAr: "بيتا كاروتين",
    status: "mushbooh",
    category: "Colors",
    source: "Carrots/algae, but carrier might use porcine gelatin",
    rulingEn: "Usually Halal in origin (carrots/plant), but commercial beta-carotene often uses pork gelatin as a stabilization carrier. Check for vegan/halal mark.",
    rulingUr: "اصل میں گاجر سے بننے کی وجہ سے حلال ہے، لیکن مائع یا پاؤڈر کو مستحکم رکھنے کے لیے اکثر جیلیٹن ملایا جاتا ہے۔",
    rulingAr: "الأصل فيه الحلال، لكن قد تستخدم جيلاتين حيواني كمادة حاملة، لذا يفضل التثبت.",
    commonIn: "Orange drinks, butter, margarine, cheddar cheese, custards."
  },
  {
    code: "E100",
    nameEn: "Curcumin (Turmeric Yellow)",
    nameUr: "کُرکومین (ہلدی کا قدرتی رنگ)",
    nameAr: "الكركمين (أصفر الكركم)",
    status: "halal",
    category: "Colors",
    source: "Turmeric root (Rhizomes of Curcuma longa)",
    rulingEn: "100% Halal. Extracted entirely from the natural turmeric plant root.",
    rulingUr: "سو فیصد حلال۔ قدرتی ہلدی کی جڑوں سے کشید کیا جاتا ہے۔",
    rulingAr: "حلال 100٪، مستخلص طبيعي من جذور نبات الكركم.",
    commonIn: "Mustard, yellow cheeses, curry powders, butter, margarines."
  },
  {
    code: "E101",
    nameEn: "Riboflavin (Vitamin B2)",
    nameUr: "رائیبو فلاوین (وٹامن بی 2)",
    nameAr: "ريبوفلافين (فيتامين ب2)",
    status: "halal",
    category: "Colors & Vitamins",
    source: "Bacterial fermentation / Yeast / Plant",
    rulingEn: "Halal. Produced commercially through micro-organism fermentation and yeast.",
    rulingUr: "حلال۔ بیکٹیریا اور خمیر کی قدرتی ابال کے ذریعے تیار کیا جاتا ہے۔",
    rulingAr: "حلال، ينتج تجارياً بواسطة تخمير الكائنات الحية الدقيقة والخميرة.",
    commonIn: "Fortified cereals, baby foods, energy drinks, milk products."
  },
  {
    code: "E140",
    nameEn: "Chlorophylls",
    nameUr: "کلوروفل (سبز پودوں کا قدرتی مادہ)",
    nameAr: "الكلوروفيل (الخضاب النباتي)",
    status: "halal",
    category: "Colors",
    source: "Grass, spinach, nettles (100% Plant)",
    rulingEn: "Halal. Natural green pigment extracted from grass, alfalfa, and nettles.",
    rulingUr: "حلال۔ پودوں اور پالک وغیرہ سے حاصل کردہ قدرتی سبز مادہ۔",
    rulingAr: "حلال، صبغة خضراء طبيعية مستخلصة من أوراق النباتات.",
    commonIn: "Green confectionery, chewing gums, cordials, mint sweets."
  },
  {
    code: "E150a",
    nameEn: "Plain Caramel (Caramel I)",
    nameUr: "سادہ کیریمل (جلی ہوئی شکر)",
    nameAr: "الكراميل البسيط",
    status: "halal",
    category: "Colors",
    source: "Heating sucrose, glucose, or dextrose (Sugar)",
    rulingEn: "Halal. Made by controlled heating of food-grade carbohydrates/sugars.",
    rulingUr: "حلال۔ خالص چینی یا مٹھاس کو گرم کر کے تیار کیا جاتا ہے۔",
    rulingAr: "حلال، يصنع بتسخين السكريات الطبيعية تحت درجات حرارة محددة.",
    commonIn: "Soft drinks, colas, gravies, dark breads, beers, vinegar."
  },
  {
    code: "E200",
    nameEn: "Sorbic Acid",
    nameUr: "سوربک ایسڈ",
    nameAr: "حمض السوربيك",
    status: "halal",
    category: "Preservatives",
    source: "Rowan berries or synthetic chemical",
    rulingEn: "Halal. Synthetic organic acid inhibiting fungal/mold growth.",
    rulingUr: "حلال۔ قدرتی پھلوں یا محفوظ کیمیائی عمل سے تیار کیا جانے والا پھپھوندی کش مادہ۔",
    rulingAr: "حلال، مادة حافظة مضادة للعفن تصنع عضوياً.",
    commonIn: "Cheese slices, dried fruits, fruit juices, yogurts."
  },
  {
    code: "E211",
    nameEn: "Sodium Benzoate",
    nameUr: "سوڈیم بینزوایٹ",
    nameAr: "بنزوات الصوديوم",
    status: "halal",
    category: "Preservatives",
    source: "Synthetic organic salt",
    rulingEn: "Halal. Synthetic food preservative safe from animal contamination.",
    rulingUr: "حلال۔ مصنوعی نامیاتی نمک جس میں کسی جانور کا عنصر شامل نہیں ہوتا۔",
    rulingAr: "حلال، ملح كيميائي حافظ خالٍ من أي مشتقات حيوانية.",
    commonIn: "Acidic foods, carbonated sodas, pickles, jams, fruit juices."
  },
  {
    code: "E260",
    nameEn: "Acetic Acid (Vinegar)",
    nameUr: "ایسٹک ایسڈ (سرکہ)",
    nameAr: "حمض الأسيتيك (الخل)",
    status: "halal",
    category: "Acids & Preservatives",
    source: "Bacterial fermentation of alcohol / Synthetic",
    rulingEn: "100% Halal based on Hadith: 'What an excellent condiment is vinegar' (Sahih Muslim).",
    rulingUr: "حلال۔ حدیثِ نبوی ﷺ ہے: «سرکہ کیا ہی بہترین سالن ہے» (صحیح مسلم)۔ مکمل شرعی سرکہ حلال ہے۔",
    rulingAr: "حلال 100٪ لقول النبي ﷺ: «نِعْمَ الإِدَامُ الْخَلُّ» (صحيح مسلم).",
    commonIn: "Pickles, salad dressings, sauces, mayonnaise, marinades."
  },
  {
    code: "E300",
    nameEn: "Ascorbic Acid (Vitamin C)",
    nameUr: "ایسکوربک ایسڈ (وٹامن سی)",
    nameAr: "حمض الأسكوربيك (فيتامين ج)",
    status: "halal",
    category: "Antioxidants",
    source: "Glucose / Citrus fruits (Plant/Synthetic)",
    rulingEn: "Halal. Produced from natural glucose fermentation; standard Vitamin C.",
    rulingUr: "حلال۔ گلوکوز اور ترش پھلوں سے تیار شدہ قدرتی وٹامن سی۔",
    rulingAr: "حلال، مضاد أكسدة مشتق من الجلوكوز الطبيعي وفيتامين ج.",
    commonIn: "Fruit juices, bread doughs, cured meats, jams, canned fruits."
  },
  {
    code: "E322",
    nameEn: "Lecithin (Soy Lecithin)",
    nameUr: "لیسیتھین (سویا لیسیتھین)",
    nameAr: "الليسيثين (ليسيثين الصويا)",
    status: "halal",
    category: "Emulsifiers",
    source: "Soybeans, sunflower seeds, or egg yolks",
    rulingEn: "Halal. More than 98% of commercial lecithin comes from soybeans or sunflower oil.",
    rulingUr: "حلال۔ تجارتی سطح پر 98 فیصد لیسیتھین سویا بین یا سورج مکھی کے بیجوں سے حاصل ہوتا ہے۔",
    rulingAr: "حلال غالباً، حيث يستخرج الأغلب الساحق منه من فول الصويا أو دوار الشمس.",
    commonIn: "Chocolates, confectionery, baby formula, margarine, instant powders."
  },
  {
    code: "E330",
    nameEn: "Citric Acid",
    nameUr: "سائٹرک ایسڈ (ٹارٹری / لیموں کا ست)",
    nameAr: "حمض الستريك (ملح الليمون)",
    status: "halal",
    category: "Acids & Flavors",
    source: "Citrus fruits or fungal fermentation of molasses",
    rulingEn: "100% Halal. Natural acid found in lemons, limes, and produced via fermentation.",
    rulingUr: "حلال۔ لیموں کا قدرتی ست یا شکر کی خمیر سے بننے والا بے ضرر حلال تیزاب۔",
    rulingAr: "حلال 100٪، مستخلص طبيعي من الحمضيات وتخمير السكر.",
    commonIn: "Soft drinks, candies, jams, canned tomatoes, ice cream."
  },
  {
    code: "E407",
    nameEn: "Carrageenan",
    nameUr: "کیراجینن (سمندری گھاس کا گوند)",
    nameAr: "كاراجينان (مستخلص الطحالب البحرية)",
    status: "halal",
    category: "Gelling & Thickeners",
    source: "Red edible seaweeds (100% Plant/Marine)",
    rulingEn: "100% Halal and Vegetarian alternative to Gelatin.",
    rulingUr: "سو فیصد حلال اور جانوروں کے جیلیٹن کا سب سے بہترین متبادل نباتی مادہ۔",
    rulingAr: "حلال 100٪ ونباتي ممتاز كبديل شرعي آمن للجيلاتين الحيواني.",
    commonIn: "Flavored milks, vegan jelly, ice creams, deli meats, yogurts."
  },
  {
    code: "E412",
    nameEn: "Guar Gum",
    nameUr: "گوآر گم (گوار کی پھلی کا گوند)",
    nameAr: "صمغ الغوار",
    status: "halal",
    category: "Thickeners",
    source: "Guar beans (Cyamopsis tetragonoloba)",
    rulingEn: "100% Halal. Extracted directly from agricultural guar beans.",
    rulingUr: "سو فیصد حلال۔ قدرتی گوار کی پھلیوں سے نکالا جاتا ہے۔",
    rulingAr: "حلال تماماً، مستخرج نباتي زراعي من بذور نبات الغوار.",
    commonIn: "Sauces, gluten-free baking, dairy desserts, soups, dressings."
  },
  {
    code: "E415",
    nameEn: "Xanthan Gum",
    nameUr: "زینتھن گم",
    nameAr: "صمغ الزانثان",
    status: "halal",
    category: "Thickeners",
    source: "Bacterial fermentation of simple sugars",
    rulingEn: "Halal. Produced by fermenting glucose or sucrose with Xanthomonas campestris.",
    rulingUr: "حلال۔ چینی کے بیکٹیریل خمیر سے بننے والا سبزی خور و حلال گاڑھا کرنے والا مادہ۔",
    rulingAr: "حلال، مستحلب طبيعي مشتق من تخمير السكريات البسيطة.",
    commonIn: "Salad dressings, gluten-free bread, sauces, toothpastes, syrups."
  },
  {
    code: "E440",
    nameEn: "Pectin",
    nameUr: "پیکٹن (سیب اور ترش پھلوں کا گوند)",
    nameAr: "بكتين",
    status: "halal",
    category: "Gelling & Thickeners",
    source: "Apple pomace and citrus peels (100% Fruit)",
    rulingEn: "100% Halal fruit-based gelling agent; completely safe from animal sources.",
    rulingUr: "سو فیصد حلال۔ سیب کے گودے اور کینو کے چھلکوں سے نکالا جاتا ہے۔",
    rulingAr: "حلال 100٪، مستخلص نباتي آمن تماماً من قشور التفاح والحمضيات.",
    commonIn: "Jams, marmalades, fruit jellies, dessert fillings."
  },
  {
    code: "E500",
    nameEn: "Sodium Carbonates (Baking Soda)",
    nameUr: "سوڈیم کاربونیٹ (میٹھا سوڈا / بیکنگ سوڈا)",
    nameAr: "كربونات الصوديوم (بيكربونات الصودا)",
    status: "halal",
    category: "Raising Agents",
    source: "Mineral salt or Solvay process",
    rulingEn: "100% Halal. Mineral-derived natural raising agent.",
    rulingUr: "سو فیصد حلال۔ قدرتی معدنی نمک جو بیکنگ میں عام استعمال ہوتا ہے۔",
    rulingAr: "حلال 100٪، ملح معدني نقي يستخدم في التخمير والخبز.",
    commonIn: "Cakes, breads, biscuits, baking powder, effervescent drinks."
  },
  {
    code: "E955",
    nameEn: "Sucralose (Splenda)",
    nameUr: "سکرالوز (مصنوعی میٹھا)",
    nameAr: "سكرالوز",
    status: "halal",
    category: "Sweeteners",
    source: "Chlorination of sucrose sugar",
    rulingEn: "Halal zero-calorie artificial sweetener.",
    rulingUr: "حلال۔ چینی کے کیمیائی عمل سے تیار ہونے والا زیرو کیلوری میٹھا مادہ۔",
    rulingAr: "حلال، محلي صناعي خالٍ من السعرات الحرارية.",
    commonIn: "Diet sodas, sugar-free chewing gums, diabetic desserts, syrups."
  },
  {
    code: "Rennet",
    nameEn: "Rennet (Animal vs Microbial)",
    nameUr: "رینٹ (پنیر جمانے کا اینزائم)",
    nameAr: "المنفحة (إنزيم تجبين الحليب)",
    status: "mushbooh",
    category: "Enzymes",
    source: "Calf stomach or Microbial/Vegetable source",
    rulingEn: "Hanafi ruling: Animal rennet from dead cattle is permissible as long as not from pork, but other Madhabs require Zabiha. 'Microbial' or 'Vegetarian' rennet is 100% Halal unanimously.",
    rulingUr: "فقہ حنفی میں گائے/بچھڑے کا رینٹ غیر ذبیحہ ہونے پر بھی پاک مانا گیا ہے، بشرطیکہ خنزیر نہ ہو۔ لیکن مائیکروبیل (نباتی) رینٹ تمام ائمہ کے نزدیک متفقہ حلال ہے۔",
    rulingAr: "مشبوه؛ ورخص الحنفية في منفحة الميتة غير الخنزير، والأنقى والأحوط اختيار الجبن المصنوع بمنفحة ميكروبية أو نباتية.",
    commonIn: "Cheddar, Parmesan, Gouda, Mozzarella, artisan cheeses."
  },
  {
    code: "Whey",
    nameEn: "Whey Powder / Whey Protein",
    nameUr: "وے پروٹین (پنیر کا پانی / پروٹین)",
    nameAr: "مسحوق مصل اللبن (بروتين مصل الحليب)",
    status: "mushbooh",
    category: "Dairy by-products",
    source: "Cheese production by-product",
    rulingEn: "Depends on the rennet enzyme used in the cheese process. If microbial rennet was used, it is Halal. Always prefer Halal-certified whey protein.",
    rulingUr: "پنیر بناتے وقت استعمال ہونے والے رینٹ اینزائم پر منحصر ہے۔ حلال تصدیق شدہ یا مائیکروبیل رینٹ والی وے پروٹین حلال ہے۔",
    rulingAr: "يعتمد على الإنزيم المستخدم في تصنيع الجبن (ميكروبي حلال، خنزيري محرم).",
    commonIn: "Gym protein shakes, infant formula, chocolates, biscuits, snack seasonings."
  }
];

export default function HalalCheckerView({ navigateToTab }) {
  const { lang, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'halal', 'haram', 'mushbooh'
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const set = new Set();
    E_CODES_DATABASE.forEach(item => set.add(item.category));
    return ['all', ...Array.from(set)];
  }, []);

  const filteredData = useMemo(() => {
    return E_CODES_DATABASE.filter(item => {
      // Status filter
      if (selectedFilter !== 'all' && item.status !== selectedFilter) return false;
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      
      // Search term
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase().trim();
      const codeMatch = item.code.toLowerCase().includes(q) || item.code.replace('e', '').includes(q);
      const nameMatch = item.nameEn.toLowerCase().includes(q) || item.nameUr.toLowerCase().includes(q) || item.nameAr.toLowerCase().includes(q);
      const sourceMatch = item.source.toLowerCase().includes(q);
      return codeMatch || nameMatch || sourceMatch;
    });
  }, [searchTerm, selectedFilter, selectedCategory]);

  const counts = useMemo(() => {
    return {
      total: E_CODES_DATABASE.length,
      halal: E_CODES_DATABASE.filter(i => i.status === 'halal').length,
      haram: E_CODES_DATABASE.filter(i => i.status === 'haram').length,
      mushbooh: E_CODES_DATABASE.filter(i => i.status === 'mushbooh').length,
    };
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'halal':
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            background: 'rgba(16, 185, 129, 0.15)', color: '#059669',
            border: '1.5px solid #10b981', padding: '4px 12px',
            borderRadius: '20px', fontWeight: 800, fontSize: '0.82rem'
          }}>
            <ShieldCheck size={16} />
            {lang === 'ar' ? 'حلال (مباح)' : (lang === 'ur' || lang === 'br') ? 'حلال (جائز)' : 'HALAL'}
          </span>
        );
      case 'haram':
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            background: 'rgba(239, 68, 68, 0.15)', color: '#dc2626',
            border: '1.5px solid #ef4444', padding: '4px 12px',
            borderRadius: '20px', fontWeight: 800, fontSize: '0.82rem'
          }}>
            <XCircle size={16} />
            {lang === 'ar' ? 'حرام (محرم)' : (lang === 'ur' || lang === 'br') ? 'حرام (ناجائز)' : 'HARAM'}
          </span>
        );
      case 'mushbooh':
      default:
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            background: 'rgba(245, 158, 11, 0.15)', color: '#d97706',
            border: '1.5px solid #f59e0b', padding: '4px 12px',
            borderRadius: '20px', fontWeight: 800, fontSize: '0.82rem'
          }}>
            <AlertTriangle size={16} />
            {lang === 'ar' ? 'مشبوه (تفصيل وتثبت)' : (lang === 'ur' || lang === 'br') ? 'مشکوک (تفصیل طلب)' : 'MUSHBOOH'}
          </span>
        );
    }
  };

  const isRtl = lang === 'ur' || lang === 'ar' || lang === 'br';

  return (
    <div style={{ background: 'var(--bg-main, #f8fafc)', minHeight: '90vh', padding: '2rem 1rem', direction: isRtl ? 'rtl' : 'ltr' }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>

        {/* ── Hero Banner ── */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)',
          borderRadius: '24px', padding: '2.5rem 2rem', color: '#ffffff',
          textAlign: 'center', marginBottom: '2rem',
          border: '2px solid #10b981', boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', border: '1px solid rgba(16,185,129,0.4)', marginBottom: '1rem' }}>
            <Sparkles size={16} style={{ color: '#34d399' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.5px' }}>
              {lang === 'ar' ? 'الدليل الفقهي للغذاء الحلال والأرقام الأوروبية' : (lang === 'ur' || lang === 'br') ? 'مستند شرعی انسائیکلوپیڈیا برائے حلال و حرام خوراک' : 'SHARIAH FOOD & E-NUMBERS ENCYCLOPEDIA'}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, margin: '0 0 0.75rem', color: '#ffffff' }}>
            {lang === 'ar' ? 'دليل الأغذية الحلال وفاحص الأرقام الأوروبية (E-Numbers)' : (lang === 'ur' || lang === 'br') ? 'حلال و حرام اجزاء اور ای-کوڈز انسائیکلوپیڈیا' : 'Halal Food Ingredients & E-Codes Checker'}
          </h1>
          <p style={{ color: '#a7f3d0', fontSize: '1rem', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
            {lang === 'ar' 
              ? 'تحقق فوراً من الأرقام الأوروبية المضافة للأغذية (E100-E1500) والمكونات المشبوهة، مع بيان الحكم الشرعي وأصل المصدر وفق فتاوى المجامع الفقهية وهيئات الحلال المعتمدة.'
              : (lang === 'ur' || lang === 'br')
              ? 'اشیائے خورونوش پر درج ای-کوڈز (E100-E1500)، جیلیٹن اور ایملسیفائر کی فوری شرعی تحقیق کریں۔ معتبر فقہی اصولوں اور حلال اتھارٹیز کے مستند فتاویٰ کی روشنی میں۔'
              : 'Instantly search food additive E-numbers (E100-E1500), emulsifiers, and doubtful ingredients with authentic Islamic jurisprudence and rulings.'}
          </p>

          {/* Quick Counter Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.12)', padding: '8px 18px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{lang === 'ar' ? 'إجمالي المكونات:' : (lang === 'ur' || lang === 'br') ? 'کل اجزاء:' : 'Total Items:'}</span>
              <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{counts.total}</strong>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid #10b981', padding: '8px 18px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#a7f3d0', fontSize: '0.85rem' }}>{lang === 'ar' ? 'حلال مباح:' : (lang === 'ur' || lang === 'br') ? 'حلال:' : 'Halal:'}</span>
              <strong style={{ color: '#34d399', fontSize: '1.1rem' }}>{counts.halal}</strong>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid #f59e0b', padding: '8px 18px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#fde68a', fontSize: '0.85rem' }}>{lang === 'ar' ? 'مشبوه يحتاج تثبت:' : (lang === 'ur' || lang === 'br') ? 'مشکوک:' : 'Mushbooh:'}</span>
              <strong style={{ color: '#fbbf24', fontSize: '1.1rem' }}>{counts.mushbooh}</strong>
            </div>
            <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', padding: '8px 18px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#fca5a5', fontSize: '0.85rem' }}>{lang === 'ar' ? 'محرم تجنبه:' : (lang === 'ur' || lang === 'br') ? 'حرام:' : 'Haram:'}</span>
              <strong style={{ color: '#f87171', fontSize: '1.1rem' }}>{counts.haram}</strong>
            </div>
          </div>
        </div>

        {/* ── Search & Filter Control Bar ── */}
        <div style={{
          background: '#ffffff', borderRadius: '20px', padding: '1.5rem',
          border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 320px' }}>
              <Search size={18} style={{
                position: 'absolute', [isRtl ? 'right' : 'left']: '14px', top: '50%',
                transform: 'translateY(-50%)', color: '#94a3b8'
              }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={lang === 'ar' ? 'ابحث برقم الكود مثل (471, 120) أو اسم المكون (جيلاتين)...' : (lang === 'ur' || lang === 'br') ? 'کوڈ نمبر (مثلاً 471, 120) یا اجزاء (جیلیٹن، رینٹ) سے سرچ کریں...' : 'Search E-code (e.g. 471, 120), Gelatin, Rennet, Carmine...'}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: isRtl ? '12px 42px 12px 16px' : '12px 16px 12px 42px',
                  borderRadius: '14px', border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s',
                  background: '#f8fafc'
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute', [isRtl ? 'left' : 'right']: '12px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none', border: 'none',
                    color: '#94a3b8', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 800
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filter Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: lang === 'ar' ? 'الكل' : (lang === 'ur' || lang === 'br') ? 'تمام اجزاء' : 'All', color: '#0f172a' },
                { id: 'halal', label: '🟢 ' + (lang === 'ar' ? 'حلال فقط' : (lang === 'ur' || lang === 'br') ? 'صرف حلال' : 'Halal Only'), color: '#059669' },
                { id: 'mushbooh', label: '🟡 ' + (lang === 'ar' ? 'مشبوه' : (lang === 'ur' || lang === 'br') ? 'مشکوک' : 'Mushbooh'), color: '#d97706' },
                { id: 'haram', label: '🔴 ' + (lang === 'ar' ? 'محرم' : (lang === 'ur' || lang === 'br') ? 'حرام' : 'Haram'), color: '#dc2626' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id)}
                  style={{
                    padding: '8px 16px', borderRadius: '12px', border: 'none',
                    fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer',
                    background: selectedFilter === f.id ? f.color : '#f1f5f9',
                    color: selectedFilter === f.id ? '#ffffff' : '#475569',
                    transition: 'all 0.2s'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* ── Results List ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: '1.25rem' }}>
          {filteredData.map((item) => (
            <div
              key={item.code}
              style={{
                background: '#ffffff', borderRadius: '18px', padding: '1.5rem',
                border: item.status === 'haram' 
                  ? '2px solid rgba(239,68,68,0.4)' 
                  : item.status === 'mushbooh'
                  ? '2px solid rgba(245,158,11,0.4)'
                  : '1px solid #e2e8f0',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Header row: Code & Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{
                    fontSize: '1.25rem', fontWeight: 900, fontFamily: 'monospace',
                    color: '#0f172a', background: '#f1f5f9', padding: '4px 12px',
                    borderRadius: '10px'
                  }}>
                    {item.code}
                  </span>
                  {getStatusBadge(item.status)}
                </div>

                {/* Name */}
                <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  {lang === 'ar' ? item.nameAr : (lang === 'ur' || lang === 'br') ? item.nameUr : item.nameEn}
                </h3>
                {lang !== 'en' && (
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem', fontStyle: 'italic' }}>
                    {item.nameEn}
                  </div>
                )}

                {/* Source */}
                <div style={{
                  background: '#f8fafc', padding: '8px 12px', borderRadius: '10px',
                  marginBottom: '1rem', fontSize: '0.85rem'
                }}>
                  <strong style={{ color: '#475569' }}>
                    {lang === 'ar' ? 'المصدر والمنشأ: ' : (lang === 'ur' || lang === 'br') ? 'ماخذ / ذریعہ: ' : 'Source: '}
                  </strong>
                  <span style={{ color: '#0f172a' }}>{item.source}</span>
                </div>

                {/* Shariah Ruling */}
                <div style={{
                  background: item.status === 'haram' ? '#fef2f2' : item.status === 'mushbooh' ? '#fffbeb' : '#f0fdf4',
                  padding: '12px 14px', borderRadius: '12px', marginBottom: '1rem',
                  borderLeft: isRtl ? 'none' : `4px solid ${item.status === 'haram' ? '#ef4444' : item.status === 'mushbooh' ? '#f59e0b' : '#10b981'}`,
                  borderRight: isRtl ? `4px solid ${item.status === 'haram' ? '#ef4444' : item.status === 'mushbooh' ? '#f59e0b' : '#10b981'}` : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Info size={15} style={{ color: item.status === 'haram' ? '#dc2626' : item.status === 'mushbooh' ? '#d97706' : '#059669' }} />
                    <strong style={{ fontSize: '0.84rem', color: item.status === 'haram' ? '#991b1b' : item.status === 'mushbooh' ? '#92400e' : '#065f46' }}>
                      {lang === 'ar' ? 'الحكم الفقهي' : (lang === 'ur' || lang === 'br') ? 'شرعی حکم و فقہی وجہ' : 'Shariah Ruling'}
                    </strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: '#334155' }}>
                    {lang === 'ar' ? item.rulingAr : (lang === 'ur' || lang === 'br') ? item.rulingUr : item.rulingEn}
                  </p>
                </div>
              </div>

              {/* Common in */}
              <div style={{ fontSize: '0.78rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                <strong>{lang === 'ar' ? 'أين يوجد غالباً: ' : (lang === 'ur' || lang === 'br') ? 'کن اشیاء میں عام ہے: ' : 'Common In: '}</strong>
                <span>{item.commonIn}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div style={{
            background: '#ffffff', borderRadius: '20px', padding: '3.5rem 2rem',
            textAlign: 'center', border: '1px solid #e2e8f0', marginTop: '1rem'
          }}>
            <HelpCircle size={48} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', color: '#1e293b' }}>
              {lang === 'ar' ? 'لم يتم العثور على نتائج' : (lang === 'ur' || lang === 'br') ? 'کوئی نتیجہ نہیں ملا' : 'No Additives Found'}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '450px', margin: '0 auto' }}>
              {lang === 'ar' ? 'جرب البحث برقم آخر، مثلاً E120 أو E471 أو ابحث باسم المكون باللغة الإنجليزية.' : (lang === 'ur' || lang === 'br') ? 'براہِ کرم کسی دوسرے کوڈ نمبر مثلاً 120، 471، یا انگریزی نام سے سرچ کریں۔' : 'Try searching by a specific E-number like 120 or 471, or search by ingredient name.'}
            </p>
          </div>
        )}

        {/* ── Educational Shariah Guideline Card ── */}
        <div style={{
          marginTop: '3rem', background: '#ffffff', borderRadius: '20px',
          padding: '2rem', border: '1.5px solid #10b981', boxShadow: '0 6px 20px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <BookOpen size={24} style={{ color: '#059669' }} />
            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#064e3b' }}>
              {lang === 'ar' ? 'القواعد الفقهية الأساسية في الأطعمة والأشربة' : (lang === 'ur' || lang === 'br') ? 'خوراک و مشروبات میں حلال و حرام کے بنیادی شرعی اصول' : 'Key Islamic Jurisprudence Rules on Food'}
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem', fontSize: '0.88rem', color: '#334155', lineHeight: 1.6 }}>
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 6px', color: '#0f172a', fontWeight: 800 }}>
                1. {lang === 'ar' ? 'الأصل في الأشياء الإباحة' : (lang === 'ur' || lang === 'br') ? 'اشیاء میں اصل حلت ہے' : 'Original Status is Permissibility'}
              </h4>
              <p style={{ margin: 0 }}>
                {lang === 'ar'
                  ? 'الأصل في جميع الأطعمة والنباتات والمعادن الطهارة والحل ما لم يثبت دليل شرعي قطعي على التحريم أو الضرر.'
                  : (lang === 'ur' || lang === 'br')
                  ? 'تمام نباتات، معدنیات اور خالص اشیاء اصلاً حلال اور پاک ہیں، جب تک کہ قرآن و سنت سے ان کی حرمت، نجاست یا ضرر ثابت نہ ہو۔'
                  : 'All plant-based and mineral substances are fundamentally Halal unless proven harmful or explicitly forbidden.'}
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 6px', color: '#0f172a', fontWeight: 800 }}>
                2. {lang === 'ar' ? 'الاستحالة وتغير الماهية' : (lang === 'ur' || lang === 'br') ? 'استحالہ (کیمیائی تبدیلی)' : 'Istihalah (Chemical Transformation)'}
              </h4>
              <p style={{ margin: 0 }}>
                {lang === 'ar'
                  ? 'الاستحالة هي تحول المادة النجسة إلى مادة أخرى تماماً في خواصها الكيميائية والفيزيائية، وتعد مطهرة عند الحنفية وجمع من العلماء.'
                  : (lang === 'ur' || lang === 'br')
                  ? 'اگر کسی ناپاک چیز کی حقیقت اور کیمیائی ماہیت مکمل طور پر تبدیل ہو کر ایک بالکل نئی چیز بن جائے تو فقہ حنفی میں اسے پاک مانا جاتا ہے۔'
                  : 'If an impure substance undergoes complete chemical transformation into a completely new compound, classical scholars consider it pure.'}
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 6px', color: '#0f172a', fontWeight: 800 }}>
                3. {lang === 'ar' ? 'دع ما يريبك إلى ما لا يريبك' : (lang === 'ur' || lang === 'br') ? 'مشکوک سے پرہیز (تقویٰ)' : 'Doubtful Matters & Taqwa'}
              </h4>
              <p style={{ margin: 0 }}>
                {lang === 'ar'
                  ? 'قال النبي ﷺ: «فَمَنِ اتَّقَى الشُّبُهَاتِ اسْتَبْرَأَ لِدِينِهِ وَعِرْضِهِ». يفضل اختيار المنتجات التي تحمل شعار الحلال المعتمد.'
                  : (lang === 'ur' || lang === 'br')
                  ? 'نبی کریم ﷺ کا فرمان ہے: «جو شبہات سے بچا اس نے اپنے دین اور عزت کو بچا لیا»۔ مشکوک اشیاء میں حلال سرٹیفائیڈ اشیاء ترجیح دیں۔'
                  : 'The Prophet ﷺ advised avoiding doubtful matters. Always look for recognized authentic Halal certifications on packaged foods.'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
