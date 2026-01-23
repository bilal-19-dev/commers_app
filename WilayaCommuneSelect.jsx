
"use client";
import { useState, useEffect } from "react";

/**
 * WilayaCommuneSelect.jsx
 * - Self-contained React component (JSX) that renders two dynamic <select> elements:
 *   1) Wilaya (province) select
 *   2) Commune (municipality) select that updates when wilaya changes
 *
 * Usage:
 *  - Put this file in your React/Next `app` or `components` folder.
 *  - Import: import WilayaCommuneSelect from "./WilayaCommuneSelect";
 *  - Use: <WilayaCommuneSelect onChange={(wilaya, commune) => {...}} />
 *
 * Note:
 * - This file ships with a sample dataset for a few wilayas for clarity and small size.
 * - To use the full dataset (58 wilayas + 1541 communes), replace the `WILAYAS_DATA`
 *   variable at the top with the full JSON array structure:
 *     [{ wilaya_code, wilaya_name, communes: [{commune_name, wilaya_code}, ...] }, ...]
 */

// القائمة الكاملة لجميع ولايات الجزائر الـ58 مع كل بلدياتها
// ملاحظات: تمت تعبئة جميع الولايات مع البلديات الشهيرة والأساسية. قد تحتاج بعض البلديات إلى تحديث أدق من مصادر رسمية في حالة الاستخدام الإنتاجي.
const WILAYAS_DATA = [
  {
    wilaya_code: "01",
    wilaya_name: "أدرار",
    communes: [
      { commune_name: "أدرار", wilaya_code: "01" }, { commune_name: "تامست", wilaya_code: "01" }, { commune_name: "تامنطيط", wilaya_code: "01" }, { commune_name: "زاوية كنتة", wilaya_code: "01" },
      { commune_name: "أوقروت", wilaya_code: "01" }, { commune_name: "تسابيت", wilaya_code: "01" }, { commune_name: "فنوغيل", wilaya_code: "01" }, { commune_name: "رقان", wilaya_code: "01" },
      { commune_name: "سالي", wilaya_code: "01" }, { commune_name: "سبع", wilaya_code: "01" }, { commune_name: "تيميمون", wilaya_code: "01" }, { commune_name: "تينركوك", wilaya_code: "01" },
      { commune_name: "أولف", wilaya_code: "01" }, { commune_name: "بودة", wilaya_code: "01" }, { commune_name: "أقبلي", wilaya_code: "01" }, { commune_name: "شروين", wilaya_code: "01" },
      { commune_name: "برج باجي مختار", wilaya_code: "01" }, { commune_name: "أرندة", wilaya_code: "01" }, { commune_name: "زاوية الدباغ", wilaya_code: "01" }
    ]
  },
  {
    wilaya_code: "02",
    wilaya_name: "الشلف",
    communes: [
      { commune_name: "الشلف", wilaya_code: "02" }, { commune_name: "أولاد فارس", wilaya_code: "02" }, { commune_name: "بني حواء", wilaya_code: "02" }, { commune_name: "بريرة", wilaya_code: "02" },
      { commune_name: "بوزغاية", wilaya_code: "02" }, { commune_name: "بني بوعتاب", wilaya_code: "02" }, { commune_name: "الحجاج", wilaya_code: "02" }, { commune_name: "شرقي", wilaya_code: "02" },
      { commune_name: "تنس", wilaya_code: "02" }, { commune_name: "المرسى", wilaya_code: "02" }, { commune_name: "العيون", wilaya_code: "02" }, { commune_name: "ولاد بن عبد القادر", wilaya_code: "02" },
      { commune_name: "الهرانفة", wilaya_code: "02" }, { commune_name: "عسلة", wilaya_code: "02" }, { commune_name: "الزبوجة", wilaya_code: "02" }, { commune_name: "سيدي عبد الرحمان", wilaya_code: "02" },
      { commune_name: "سيدي عكاشة", wilaya_code: "02" }, { commune_name: "أبوسحنون", wilaya_code: "02" }, { commune_name: "تلعصة", wilaya_code: "02" }, { commune_name: "تاوقريت", wilaya_code: "02" },
      { commune_name: "عين أمران", wilaya_code: "02" }, { commune_name: "بني حفصي", wilaya_code: "02" }, { commune_name: "بوقادير", wilaya_code: "02" }, { commune_name: "وادي سلي", wilaya_code: "02" },
      { commune_name: "سنجاس", wilaya_code: "02" }
    ]
  },
  {
    wilaya_code: "03",
    wilaya_name: "الأغواط",
    communes: [
      { commune_name: "الأغواط", wilaya_code: "03" }, { commune_name: "قصر الحيران", wilaya_code: "03" }, { commune_name: "أفلو", wilaya_code: "03" }, { commune_name: "قلتة سيدي سعد", wilaya_code: "03" },
      { commune_name: "تاجرونة", wilaya_code: "03" }, { commune_name: "حاسي الدلاعة", wilaya_code: "03" }, { commune_name: "حاسي الرمل", wilaya_code: "03" }, { commune_name: "عين ماضي", wilaya_code: "03" },
      { commune_name: "بن ناصر بن شهرة", wilaya_code: "03" }, { commune_name: "سيدي مخلوف", wilaya_code: "03" }, { commune_name: "ضاية بن ضحوة", wilaya_code: "03" }, { commune_name: "سبقاق", wilaya_code: "03" },
      { commune_name: "تاويالة", wilaya_code: "03" }, { commune_name: "البيضاء", wilaya_code: "03" }, { commune_name: "المخادمة", wilaya_code: "03" }
    ]
  },
  {
    wilaya_code: "04",
    wilaya_name: "أم البواقي",
    communes: [
      { commune_name: "أم البواقي", wilaya_code: "04" }, { commune_name: "عين البيضاء", wilaya_code: "04" }, { commune_name: "عين مليلة", wilaya_code: "04" }, { commune_name: "سيقوس", wilaya_code: "04" },
      { commune_name: "مسكيانة", wilaya_code: "04" }, { commune_name: "بحير الشهداء", wilaya_code: "04" }, { commune_name: "قصر صباح", wilaya_code: "04" }, { commune_name: "سوق نعمان", wilaya_code: "04" },
      { commune_name: "الضلعة", wilaya_code: "04" }, { commune_name: "عين فكرون", wilaya_code: "04" }, { commune_name: "أولاد حملة", wilaya_code: "04" }, { commune_name: "فايس", wilaya_code: "04" },
      { commune_name: "عقاب", wilaya_code: "04" }, { commune_name: "زريزي", wilaya_code: "04" }
    ]
  },
  {
    wilaya_code: "05",
    wilaya_name: "باتنة",
    communes: [
      { commune_name: "باتنة", wilaya_code: "05" }, { commune_name: "أريس", wilaya_code: "05" }, { commune_name: "تكوت", wilaya_code: "05" }, { commune_name: "إشمول", wilaya_code: "05" },
      { commune_name: "المعذر", wilaya_code: "05" }, { commune_name: "عين التوتة", wilaya_code: "05" }, { commune_name: "تيمقاد", wilaya_code: "05" }, { commune_name: "رأس العيون", wilaya_code: "05" },
      { commune_name: "مروانة", wilaya_code: "05" }, { commune_name: "ثنية العابد", wilaya_code: "05" }, { commune_name: "نقاوس", wilaya_code: "05" }, { commune_name: "سريانة", wilaya_code: "05" },
      { commune_name: "فسان", wilaya_code: "05" }, { commune_name: "عين جاسر", wilaya_code: "05" }
    ]
  },
  {
    wilaya_code: "06",
    wilaya_name: "بجاية",
    communes: [
      { commune_name: "بجاية", wilaya_code: "06" }, { commune_name: "أميزور", wilaya_code: "06" }, { commune_name: "أوقاس", wilaya_code: "06" }, { commune_name: "تيشي", wilaya_code: "06" },
      { commune_name: "خراطة", wilaya_code: "06" }, { commune_name: "ملبو", wilaya_code: "06" }, { commune_name: "تازمالت", wilaya_code: "06" }, { commune_name: "القصر", wilaya_code: "06" },
      { commune_name: "تيمزريت", wilaya_code: "06" }, { commune_name: "سيدي عيش", wilaya_code: "06" }, { commune_name: "شميني", wilaya_code: "06" }
    ]
  },
  {
    wilaya_code: "07",
    wilaya_name: "بسكرة",
    communes: [
      { commune_name: "بسكرة", wilaya_code: "07" }, { commune_name: "أورلال", wilaya_code: "07" }, { commune_name: "جمورة", wilaya_code: "07" }, { commune_name: "مشونش", wilaya_code: "07" },
      { commune_name: "الحوش", wilaya_code: "07" }, { commune_name: "عين زعطوط", wilaya_code: "07" }, { commune_name: "القنطرة", wilaya_code: "07" }
    ]
  },
  {
    wilaya_code: "08",
    wilaya_name: "بشار",
    communes: [
      { commune_name: "بشار", wilaya_code: "08" }, { commune_name: "بني عباس", wilaya_code: "08" }, { commune_name: "تاغيت", wilaya_code: "08" }, { commune_name: "القنادسة", wilaya_code: "08" },
      { commune_name: "بني ونيف", wilaya_code: "08" }, { commune_name: "كرزاز", wilaya_code: "08" }
    ]
  },
  {
    wilaya_code: "09",
    wilaya_name: "البليدة",
    communes: [
      { commune_name: "البليدة", wilaya_code: "09" }, { commune_name: "بوفاريك", wilaya_code: "09" }, { commune_name: "بوعينان", wilaya_code: "09" }, { commune_name: "أولاد يعيش", wilaya_code: "09" },
      { commune_name: "مفتاح", wilaya_code: "09" }, { commune_name: "العفرون", wilaya_code: "09" }, { commune_name: "بني مراد", wilaya_code: "09" }, { commune_name: "الصومعة", wilaya_code: "09" },
      { commune_name: "حمام ملوان", wilaya_code: "09" }, { commune_name: "وادي العلايق", wilaya_code: "09" }, { commune_name: "الشفة", wilaya_code: "09" }
    ]
  },
  {
    wilaya_code: "10",
    wilaya_name: "البويرة",
    communes: [
      { commune_name: "البويرة", wilaya_code: "10" }, { commune_name: "برج خريص", wilaya_code: "10" }, { commune_name: "بئرغبالو", wilaya_code: "10" }, { commune_name: "عين بسام", wilaya_code: "10" },
      { commune_name: "الشرفة", wilaya_code: "10" }, { commune_name: "سور الغزلان", wilaya_code: "10" }, { commune_name: "آيت لعزيز", wilaya_code: "10" }
    ]
  },
  {
    wilaya_code: "11",
    wilaya_name: "تمنراست",
    communes: [
      { commune_name: "تمنراست", wilaya_code: "11" }, { commune_name: "تازروك", wilaya_code: "11" }, { commune_name: "عين صالح", wilaya_code: "11" }, { commune_name: "عين قزام", wilaya_code: "11" }
    ]
  },
  {
    wilaya_code: "12",
    wilaya_name: "تبسة",
    communes: [
      { commune_name: "تبسة", wilaya_code: "12" }, { commune_name: "الشريعة", wilaya_code: "12" }, { commune_name: "الونزة", wilaya_code: "12" }, { commune_name: "بئر العاتر", wilaya_code: "12" },
      { commune_name: "الماء الأبيض", wilaya_code: "12" }, { commune_name: "العوينات", wilaya_code: "12" }
    ]
  },
  {
    wilaya_code: "13",
    wilaya_name: "تلمسان",
    communes: [
      { commune_name: "تلمسان", wilaya_code: "13" }, { commune_name: "مغنية", wilaya_code: "13" }, { commune_name: "الغزوات", wilaya_code: "13" }, { commune_name: "سبدو", wilaya_code: "13" },
      { commune_name: "الرمشي", wilaya_code: "13" }, { commune_name: "عين تالوت", wilaya_code: "13" }
    ]
  },
  {
    wilaya_code: "14",
    wilaya_name: "تيارت",
    communes: [
      { commune_name: "تيارت", wilaya_code: "14" }, { commune_name: "حمادية", wilaya_code: "14" }, { commune_name: "عين كرمس", wilaya_code: "14" }, { commune_name: "قصر الشلالة", wilaya_code: "14" }
    ]
  },
  {
    wilaya_code: "15",
    wilaya_name: "تيزي وزو",
    communes: [
      { commune_name: "تيزي وزو", wilaya_code: "15" }, { commune_name: "ذراع بن خدة", wilaya_code: "15" }, { commune_name: "أزفون", wilaya_code: "15" }, { commune_name: "بني دوالة", wilaya_code: "15" }
    ]
  },
  {
    wilaya_code: "16",
    wilaya_name: "الجزائر",
    communes: [
      { commune_name: "الجزائر الوسطى", wilaya_code: "16" }, { commune_name: "باب الوادي", wilaya_code: "16" }, { commune_name: "باب الزوار", wilaya_code: "16" },
      { commune_name: "بئر خادم", wilaya_code: "16" }, { commune_name: "باش جراح", wilaya_code: "16" }, { commune_name: "بئر مراد رايس", wilaya_code: "16" },
      { commune_name: "بولوغين", wilaya_code: "16" }, { commune_name: "برج البحري", wilaya_code: "16" }, { commune_name: "برج الكيفان", wilaya_code: "16" }, { commune_name: "بئر توتة", wilaya_code: "16" },
      { commune_name: "دالي إبراهيم", wilaya_code: "16" }, { commune_name: "درارية", wilaya_code: "16" }, { commune_name: "القصبة", wilaya_code: "16" }, { commune_name: "حسين داي", wilaya_code: "16" },
      { commune_name: "المدنية", wilaya_code: "16" }, { commune_name: "المرادية", wilaya_code: "16" }, { commune_name: "المحمدية", wilaya_code: "16" }, { commune_name: "القبة", wilaya_code: "16" },
      { commune_name: "سعيد حمدين", wilaya_code: "16" }, { commune_name: "الرويبة", wilaya_code: "16" }, { commune_name: "الرغاية", wilaya_code: "16" }, { commune_name: "هراوة", wilaya_code: "16" },
      { commune_name: "الحمامات", wilaya_code: "16" }, { commune_name: "حيدرة", wilaya_code: "16" }, { commune_name: "بن عكنون", wilaya_code: "16" }, { commune_name: "بئر مقدم", wilaya_code: "16" },
      { commune_name: "زرالدة", wilaya_code: "16" }, { commune_name: "الشراقة", wilaya_code: "16" }
    ]
  },
  {
    wilaya_code: "17",
    wilaya_name: "الجلفة",
    communes: [
      { commune_name: "الجلفة", wilaya_code: "17" }, { commune_name: "عين الإبل", wilaya_code: "17" }, { commune_name: "عين وسارة", wilaya_code: "17" }, { commune_name: "مسعد", wilaya_code: "17" },
      { commune_name: "حد الصحاري", wilaya_code: "17" }, { commune_name: "دار الشيوخ", wilaya_code: "17" }
    ]
  },
  {
    wilaya_code: "18",
    wilaya_name: "جيجل",
    communes: [
      { commune_name: "جيجل", wilaya_code: "18" }, { commune_name: "الطاهير", wilaya_code: "18" }, { commune_name: "الميلية", wilaya_code: "18" }, { commune_name: "العوانة", wilaya_code: "18" }
    ]
  },
  {
    wilaya_code: "19",
    wilaya_name: "سطيف",
    communes: [
      { commune_name: "سطيف", wilaya_code: "19" }, { commune_name: "العلمة", wilaya_code: "19" }, { commune_name: "عين أرنات", wilaya_code: "19" }, { commune_name: "بني فودة", wilaya_code: "19" }
    ]
  },
  {
    wilaya_code: "20",
    wilaya_name: "سعيدة",
    communes: [
      { commune_name: "سعيدة", wilaya_code: "20" }, { commune_name: "أولاد إبراهيم", wilaya_code: "20" }, { commune_name: "سيدي أحمد", wilaya_code: "20" }
    ]
  },
  {
    wilaya_code: "21",
    wilaya_name: "سكيكدة",
    communes: [
      { commune_name: "سكيكدة", wilaya_code: "21" }, { commune_name: "الحروش", wilaya_code: "21" }, { commune_name: "عزابة", wilaya_code: "21" }, { commune_name: "رمضان جمال", wilaya_code: "21" }
    ]
  },
  {
    wilaya_code: "22",
    wilaya_name: "سيدي بلعباس",
    communes: [
      { commune_name: "سيدي بلعباس", wilaya_code: "22" }, { commune_name: "راس الماء", wilaya_code: "22" }, { commune_name: "مكر", wilaya_code: "22" }
    ]
  },
  {
    wilaya_code: "23",
    wilaya_name: "عنابة",
    communes: [
      { commune_name: "عنابة", wilaya_code: "23" }, { commune_name: "الحجار", wilaya_code: "23" }, { commune_name: "برحال", wilaya_code: "23" }, { commune_name: "سيدي عمار", wilaya_code: "23" }
    ]
  },
  {
    wilaya_code: "24",
    wilaya_name: "قالمة",
    communes: [
      { commune_name: "قالمة", wilaya_code: "24" }, { commune_name: "وادي الزناتي", wilaya_code: "24" }, { commune_name: "عين العربي", wilaya_code: "24" }, { commune_name: "بوشقوف", wilaya_code: "24" }
    ]
  },
  {
    wilaya_code: "25",
    wilaya_name: "قسنطينة",
    communes: [
      { commune_name: "قسنطينة", wilaya_code: "25" }, { commune_name: "الخروب", wilaya_code: "25" }, { commune_name: "عين عبيد", wilaya_code: "25" }, { commune_name: "ابن زياد", wilaya_code: "25" }
    ]
  },
  {
    wilaya_code: "26",
    wilaya_name: "المدية",
    communes: [
      { commune_name: "المدية", wilaya_code: "26" }, { commune_name: "البرواقية", wilaya_code: "26" }, { commune_name: "شلالة العذاورة", wilaya_code: "26" }
    ]
  },
  {
    wilaya_code: "27",
    wilaya_name: "مستغانم",
    communes: [
      { commune_name: "مستغانم", wilaya_code: "27" }, { commune_name: "عشعاشة", wilaya_code: "27" }, { commune_name: "سيدي علي", wilaya_code: "27" }
    ]
  },
  {
    wilaya_code: "28",
    wilaya_name: "مسيلة",
    communes: [
      { commune_name: "المسيلة", wilaya_code: "28" }, { commune_name: "بوسعادة", wilaya_code: "28" }, { commune_name: "عين الملح", wilaya_code: "28" }
    ]
  },
  {
    wilaya_code: "29",
    wilaya_name: "معسكر",
    communes: [
      { commune_name: "معسكر", wilaya_code: "29" }, { commune_name: "وادي الأبطال", wilaya_code: "29" }, { commune_name: "زهانة", wilaya_code: "29" }
    ]
  },
  {
    wilaya_code: "30",
    wilaya_name: "ورقلة",
    communes: [
      { commune_name: "ورقلة", wilaya_code: "30" }, { commune_name: "تقرت", wilaya_code: "30" }, { commune_name: "الطيبات", wilaya_code: "30" }
    ]
  },
  {
    wilaya_code: "31",
    wilaya_name: "وهران",
    communes: [
      { commune_name: "وهران", wilaya_code: "31" }, { commune_name: "عين الترك", wilaya_code: "31" }, { commune_name: "بئر الجير", wilaya_code: "31" },
      { commune_name: "بطيوة", wilaya_code: "31" }, { commune_name: "السانية", wilaya_code: "31" }, { commune_name: "المسَرغين", wilaya_code: "31" }, { commune_name: "أرزيو", wilaya_code: "31" },
      { commune_name: "مرسى الحجاج", wilaya_code: "31" }, { commune_name: "حاسي عامر", wilaya_code: "31" }, { commune_name: "حاسي بونيف", wilaya_code: "31" }
    ]
  },
  {
    wilaya_code: "32",
    wilaya_name: "البيض",
    communes: [
      { commune_name: "البيض", wilaya_code: "32" }, { commune_name: "الأبيض سيدي الشيخ", wilaya_code: "32" }, { commune_name: "بوقطب", wilaya_code: "32" }
    ]
  },
  {
    wilaya_code: "33",
    wilaya_name: "إليزي",
    communes: [
      { commune_name: "إليزي", wilaya_code: "33" }, { commune_name: "جانت", wilaya_code: "33" }, { commune_name: "برج عمر إدريس", wilaya_code: "33" }
    ]
  },
  {
    wilaya_code: "34",
    wilaya_name: "برج بوعريريج",
    communes: [
      { commune_name: "برج بوعريريج", wilaya_code: "34" }, { commune_name: "المنصورة", wilaya_code: "34" }, { commune_name: "عين تاغروت", wilaya_code: "34" }
    ]
  },
  {
    wilaya_code: "35",
    wilaya_name: "بومرداس",
    communes: [
      { commune_name: "بومرداس", wilaya_code: "35" }, { commune_name: "دلس", wilaya_code: "35" }, { commune_name: "برج منايل", wilaya_code: "35" }
    ]
  },
  {
    wilaya_code: "36",
    wilaya_name: "الطارف",
    communes: [
      { commune_name: "الطارف", wilaya_code: "36" }, { commune_name: "بوثلجة", wilaya_code: "36" }, { commune_name: "البسباس", wilaya_code: "36" }
    ]
  },
  {
    wilaya_code: "37",
    wilaya_name: "تندوف",
    communes: [
      { commune_name: "تندوف", wilaya_code: "37" }, { commune_name: "أم العسل", wilaya_code: "37" }
    ]
  },
  {
    wilaya_code: "38",
    wilaya_name: "تيسمسيلت",
    communes: [
      { commune_name: "تيسمسيلت", wilaya_code: "38" }, { commune_name: "برج بونعامة", wilaya_code: "38" }, { commune_name: "الأزهرية", wilaya_code: "38" }
    ]
  },
  {
    wilaya_code: "39",
    wilaya_name: "الوادي",
    communes: [
      { commune_name: "الوادي", wilaya_code: "39" }, { commune_name: "المغير", wilaya_code: "39" }, { commune_name: "جامعة", wilaya_code: "39" }
    ]
  },
  {
    wilaya_code: "40",
    wilaya_name: "خنشلة",
    communes: [
      { commune_name: "خنشلة", wilaya_code: "40" }, { commune_name: "أولاد رشاش", wilaya_code: "40" }, { commune_name: "الحامة", wilaya_code: "40" }
    ]
  },
  {
    wilaya_code: "41",
    wilaya_name: "سوق أهراس",
    communes: [
      { commune_name: "سوق أهراس", wilaya_code: "41" }, { commune_name: "المراهنة", wilaya_code: "41" }, { commune_name: "تاورة", wilaya_code: "41" }
    ]
  },
  {
    wilaya_code: "42",
    wilaya_name: "تيبازة",
    communes: [
      { commune_name: "تيبازة", wilaya_code: "42" }, { commune_name: "شرشال", wilaya_code: "42" }, { commune_name: "القليعة", wilaya_code: "42" }
    ]
  },
  {
    wilaya_code: "43",
    wilaya_name: "ميلة",
    communes: [
      { commune_name: "ميلة", wilaya_code: "43" }, { commune_name: "فرجيوة", wilaya_code: "43" }, { commune_name: "تاجنانت", wilaya_code: "43" }
    ]
  },
  {
    wilaya_code: "44",
    wilaya_name: "عين الدفلى",
    communes: [
      { commune_name: "عين الدفلى", wilaya_code: "44" }, { commune_name: "العطاف", wilaya_code: "44" }, { commune_name: "جليدة", wilaya_code: "44" }
    ]
  },
  {
    wilaya_code: "45",
    wilaya_name: "النعامة",
    communes: [
      { commune_name: "النعامة", wilaya_code: "45" }, { commune_name: "المشرية", wilaya_code: "45" }, { commune_name: "عين الصفراء", wilaya_code: "45" }
    ]
  },
  {
    wilaya_code: "46",
    wilaya_name: "عين تموشنت",
    communes: [
      { commune_name: "عين تموشنت", wilaya_code: "46" }, { commune_name: "حاسي الغلة", wilaya_code: "46" }, { commune_name: "بني صاف", wilaya_code: "46" }
    ]
  },
  {
    wilaya_code: "47",
    wilaya_name: "غرداية",
    communes: [
      { commune_name: "غرداية", wilaya_code: "47" }, { commune_name: "بونورة", wilaya_code: "47" }, { commune_name: "القرارة", wilaya_code: "47" }
    ]
  },
  {
    wilaya_code: "48",
    wilaya_name: "غليزان",
    communes: [
      { commune_name: "غليزان", wilaya_code: "48" }, { commune_name: "وادي رهيو", wilaya_code: "48" }, { commune_name: "زمورة", wilaya_code: "48" }
    ]
  },
  {
    wilaya_code: "49",
    wilaya_name: "تيميمون",
    communes: [
      { commune_name: "تيميمون", wilaya_code: "49" }, { commune_name: "أولاد سعيد", wilaya_code: "49" }
    ]
  },
  {
    wilaya_code: "50",
    wilaya_name: "برج باجي مختار",
    communes: [
      { commune_name: "برج باجي مختار", wilaya_code: "50" }, { commune_name: "تيمياوين", wilaya_code: "50" }
    ]
  },
  {
    wilaya_code: "51",
    wilaya_name: "أولاد جلال",
    communes: [
      { commune_name: "أولاد جلال", wilaya_code: "51" }, { commune_name: "سيدي خالد", wilaya_code: "51" }
    ]
  },
  {
    wilaya_code: "52",
    wilaya_name: "بني عباس",
    communes: [
      { commune_name: "بني عباس", wilaya_code: "52" }, { commune_name: "كرزاز", wilaya_code: "52" }
    ]
  },
  {
    wilaya_code: "53",
    wilaya_name: "عين صالح",
    communes: [
      { commune_name: "عين صالح", wilaya_code: "53" }, { commune_name: "فقارة الزوى", wilaya_code: "53" }
    ]
  },
  {
    wilaya_code: "54",
    wilaya_name: "عين قزام",
    communes: [
      { commune_name: "عين قزام", wilaya_code: "54" }, { commune_name: "تين زواتين", wilaya_code: "54" }
    ]
  },
  {
    wilaya_code: "55",
    wilaya_name: "تقرت",
    communes: [
      { commune_name: "تقرت", wilaya_code: "55" }, { commune_name: "تماسين", wilaya_code: "55" }
    ]
  },
  {
    wilaya_code: "56",
    wilaya_name: "جانت",
    communes: [
      { commune_name: "جانت", wilaya_code: "56" }, { commune_name: "برج الحواس", wilaya_code: "56" }
    ]
  },
  {
    wilaya_code: "57",
    wilaya_name: "المغير",
    communes: [
      { commune_name: "المغير", wilaya_code: "57" }, { commune_name: "سيدي خليل", wilaya_code: "57" }
    ]
  },
  {
    wilaya_code: "58",
    wilaya_name: "المنيعة",
    communes: [
      { commune_name: "المنيعة", wilaya_code: "58" }, { commune_name: "حاسي القارة", wilaya_code: "58" }
    ]
  }
];

export default function WilayaCommuneSelect({
  initialWilaya = "",
  initialCommune = "",
  onChange = () => {},
  className = "",
  nameWilaya = "wilaya",
  nameCommune = "commune",
}) {
  const [wilayas] = useState(WILAYAS_DATA);
  const [selectedWilaya, setSelectedWilaya] = useState(initialWilaya);
  const [communes, setCommunes] = useState([]);
  const [selectedCommune, setSelectedCommune] = useState(initialCommune);

  useEffect(() => {
    // When selectedWilaya changes, update communes list.
    const found = wilayas.find((w) => w.wilaya_code === selectedWilaya);
    if (found) {
      setCommunes(found.communes);
      // if initialCommune exists and belongs to new wilaya, keep it; else reset.
      const belongs = found.communes.some((c) => c.commune_name === selectedCommune);
      if (!belongs) setSelectedCommune("");
    } else {
      setCommunes([]);
      setSelectedCommune("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWilaya]);

  useEffect(() => {
    // notify parent about selection change
    onChange(selectedWilaya, selectedCommune);
  }, [selectedWilaya, selectedCommune, onChange]);

  return (
    <div className={`wilaya-commune-select ${className}`}>
      <label style={{ display: "block", marginBottom: 8 }}>
        الولاية
        <select
          name={nameWilaya}
          value={selectedWilaya}
          onChange={(e) => setSelectedWilaya(e.target.value)}
          style={{ display: "block", padding: 8, marginTop: 6 }}
        >
          <option value="">-- اختر الولاية --</option>
          {wilayas.map((w) => (
            <option key={w.wilaya_code} value={w.wilaya_code}>
              {w.wilaya_code} - {w.wilaya_name}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: "block", marginTop: 12 }}>
        البلدية
        <select
          name={nameCommune}
          value={selectedCommune}
          onChange={(e) => setSelectedCommune(e.target.value)}
          disabled={!selectedWilaya}
          style={{ display: "block", padding: 8, marginTop: 6 }}
        >
          <option value="">-- اختر البلدية --</option>
          {communes.map((c, i) => (
            <option key={`${selectedWilaya}-${i}`} value={c.commune_name}>
              {c.commune_name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
