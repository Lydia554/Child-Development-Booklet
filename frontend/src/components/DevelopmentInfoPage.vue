<template>
  <div class="development-container">
    <div
      v-for="(period, index) in developmentData"
      :key="index"
      class="development-card"
      :class="`period-${index % 4}`"
    >
      <h2>{{ period.ageRange }}</h2>

      <div
        v-for="milestone in period.milestones"
        :key="milestone.category"
        class="development-section"
        :class="milestone.category.toLowerCase().replace(/\s/g, '-')"
      >
        <h3>{{ milestone.category }}</h3>
        <p>{{ milestone.description }}</p>
      </div>

      <div v-if="period.advice" class="development-advice">
        <h3>🔹 Savet</h3>
        <p>{{ period.advice }}</p>
      </div>

      <div v-if="period.concerns" class="development-section concerns">
        <h3>❓ Šta ako dete ne dostigne ove prekretnice?</h3>
        <p>{{ period.concerns }}</p>
      </div>

      <div v-if="period.generalTips?.length" class="development-section general-tips">
        <h3>💡 Opšti saveti</h3>
        <ul>
          <li v-for="(tip, idx) in period.generalTips" :key="idx">{{ tip }}</li>
        </ul>
      </div>

      <div v-if="period.suggestedActivities?.length" class="development-section suggested-activities">
        <h3>🎲 Predložene aktivnosti</h3>
        <ul>
          <li v-for="(activity, idx) in period.suggestedActivities" :key="idx">{{ activity }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>


  
  <script>
  export default {
    data() {
      return {
        loading: false,
        developmentData: [
          {
            ageRange: "0-6 meseci",
            milestones: [
              { category: "Fizički razvoj", description: "Podizanje glave dok leži na stomaku, praćenje predmeta očima." },
              { category: "Govor i jezik", description: "Počinje da guče i ispušta različite zvuke." },
              { category: "Socijalno-emocionalni razvoj", description: "Osmehuje se ljudima, prepoznaje poznata lica." },
            ],
            advice: "Provodeći vreme pričajući i igrajući se sa bebom, podstičete njen razvoj.",
            concerns: "Ako beba ne reaguje na zvuke ili lica, konsultujte pedijatra.",
            generalTips: [
              "Pružajte puno fizičkog kontakta i osmeha.",
              "Govorite bebi tokom svakodnevnih aktivnosti.",
            ],
            suggestedActivities: [
              "Igrajte se 'skrivanja' iza ruku.",
              "Pustite nežnu muziku i posmatrajte reakcije bebe.",
            ],
          },
          {
            ageRange: "6-12 meseci",
            milestones: [
              { category: "Fizički razvoj", description: "Sedi bez podrške, puzi, stoji uz pridržavanje." },
              { category: "Govor i jezik", description: "Izgovara jednostavne reči poput 'mama' i 'tata'." },
              { category: "Socijalno-emocionalni razvoj", description: "Pokazuje strah od nepoznatih osoba, uživa u igri sa drugima." },
            ],
            advice: "Podstičite bebu da istražuje okolinu i komunicira sa vama.",
            concerns: "Ako beba ne pokazuje interesovanje za igru ili ne pokušava da se kreće, obratite se lekaru.",
            generalTips: [
              "Čitajte slikovnice i imenujte predmete.",
              "Podstičite bebu da puzi ka igračkama.",
            ],
            suggestedActivities: [
              "Igrajte se 'dodavanja' lopte.",
              "Pevajte jednostavne pesmice zajedno.",
            ],

          },


          {
            ageRange: "12-18 meseci",
            milestones: [
              { category: "Fizički razvoj", description: "Hoda bez pomoći, drži manje predmete između palca i kažiprsta, može da gradi toranj od tri kocke." },
              { category: "Opservacija", description: "Pokazuje predmete koje želi, istražuje okruženje, ume da traži skrivene predmete." },
              { category: "Socijalno-emocionalni razvoj", description: "Pokazuje naklonost, prepoznaje osnovne emocije drugih ljudi." },
              { category: "Govor i Jezik", description: "Koristi jednostavne reči, reaguje na jednostavne naredbe, pokazuje interesovanje za slikovnice." },
            ],
            concerns: "Ako dete ne hoda samostalno ili ne pokazuje interesovanje za komunikaciju, preporučuje se konsultacija sa pedijatrom.",
            generalTips: [
              "Podstičite dete da istražuje okolinu na siguran način.",
              "Čitajte zajedno slikovnice i imenujte predmete.",
              "Ohrabrujte dete da koristi jednostavne reči za izražavanje potreba."
            ],
            suggestedActivities: [
              "Igrajte se skrivalica sa igračkama kako biste podstakli opservaciju.",
              "Pružite detetu igračke koje može slagati ili ređati.",
              "Pevajte jednostavne pesmice zajedno."
            ]
          },
          {
            ageRange: "18-24 meseca",
            milestones: [
              { category: "Fizički razvoj", description: "Penje se uz stepenice uz pridržavanje, samostalno hoda i istražuje okruženje." },
              { category: "Opservacija", description: "Razlikuje poznate od nepoznatih osoba, može da koristi jednostavne alate za dohvat predmeta." },
              { category: "Socijalno-emocionalni razvoj", description: "Počinje da pokazuje osećaj vlasništva nad igračkama, traži pažnju odraslih." },
              { category: "Govor i Jezik", description: "Povezuje dve reči u jednostavne rečenice, ponavlja reči koje čuje, imenuje predmete." },
            ],
            concerns: "Ako dete ne koristi reči ili ne pokazuje interesovanje za interakciju sa drugima, obratite se stručnjaku za dečji razvoj.",
            generalTips: [
              "Podstičite samostalnost deteta u svakodnevnim aktivnostima.",
              "Ohrabrujte igru sa drugom decom kako bi se razvijale socijalne veštine.",
              "Govorite jasno i jednostavno kako bi dete lakše usvojilo nove reči."
            ],
            suggestedActivities: [
              "Igrajte se igara pretvaranja, poput kuvanja ili vožnje automobila.",
              "Pružite detetu bojanke i bojice za kreativno izražavanje.",
              "Organizujte jednostavne prepreke koje dete može savladati."
            ]
          },
          {
            ageRange: "24-30 meseci",
            milestones: [
              { category: "Fizički razvoj", description: "Trči bez pada, šutira loptu, koristi pribor za jelo bez pomoći." },
              { category: "Opservacija", description: "Prepoznaje slike u knjigama, zna da pronađe poznate predmete u prostoru." },
              { category: "Socijalno-emocionalni razvoj", description: "Igra se paralelno sa drugom decom, pokazuje prve znakove deljenja." },
              { category: "Govor i Jezik", description: "Koristi rečenice od tri reči, postavlja jednostavna pitanja." },
            ],
            concerns: "Ako dete ne pokazuje interesovanje za igru ili ne koristi jednostavne rečenice, konsultujte se sa pedijatrom.",
            generalTips: [
              "Podstičite dete da izražava svoje potrebe i želje rečima.",
              "Učite dete osnovnim pravilima ponašanja i deljenja.",
              "Čitajte zajedno knjige i razgovarajte o slikama."
            ],
            suggestedActivities: [
              "Igrajte se loptom kako biste razvili motoričke veštine.",
              "Pružite detetu slagalice sa većim delovima.",
              "Organizujte igre pretvaranja sa plišanim igračkama."
            ]
          },
          {
            ageRange: "30-36 meseci",
            milestones: [
              { category: "Fizički razvoj", description: "Koristi makaze za papir, crta osnovne oblike, presavija papir na pola." },
              { category: "Opservacija", description: "Razlikuje osnovne oblike i boje, grupiše predmete po veličini." },
              { category: "Socijalno-emocionalni razvoj", description: "Pokazuje osećaj pripadnosti grupi, počinje da imitira odrasle u igri." },
              { category: "Govor i Jezik", description: "Postavlja pitanja, razume osnovne koncepte količine (malo, puno)." },
            ],
            concerns: "Ako dete ne pokazuje interesovanje za interakciju sa vršnjacima ili ne koristi rečenice, obratite se stručnjaku.",
            generalTips: [
              "Podstičite kreativnost kroz crtanje i pravljenje oblika.",
              "Učite dete prepoznavanju boja i oblika kroz igru.",
              "Ohrabrujte postavljanje pitanja i pružajte odgovore prilagođene uzrastu."
            ],
            suggestedActivities: [
              "Pravljenje jednostavnih kolaža od obojenog papira.",
              "Igrajte se igara memorije sa karticama boja i oblika.",
              "Organizujte zajedničko kuvanje jednostavnih jela."
            ]
          },

          {
            ageRange: "36-42 meseci",
            milestones: [
              { category: "Fizički razvoj", description: "Samostalno se oblači, hoda unazad, skače na jednoj nozi." },
              { category: "Opservacija", description: "Prepoznaje osnovne emocije kod drugih, zna da grupiše igračke po funkciji." },
              { category: "Socijalno-emocionalni razvoj", description: "Učestvuje u grupnim igrama, počinje da se igra 'pretvaranja'." },
              { category: "Govor i Jezik", description: "Priča kraće priče, koristi zamenice 'ja', 'moje'." },
            ],
            concerns: "Ako dete ne može da se oblači samostalno, ne pokazuje interesovanje za interakciju sa vršnjacima ili ne koristi jednostavne rečenice, preporučuje se konsultacija sa pedijatrom.",
            generalTips: [
              "Podstičite dete da se samostalno oblači i brine o ličnoj higijeni.",
              "Ohrabrujte igru pretvaranja kako biste razvili maštu i socijalne veštine.",
              "Čitajte zajedno knjige i razgovarajte o pričama kako biste poboljšali jezičke veštine."
            ],
            suggestedActivities: [
              "Organizujte igre uloga gde dete može da se pretvara da je različite osobe ili životinje.",
              "Pružite detetu priliku da se igra sa drugom decom kroz zajedničke aktivnosti.",
              "Podstičite dete da crta i boji kako bi razvilo finu motoriku."
            ]
          },
          {
            ageRange: "46-54 meseci",
            milestones: [
              { category: "Fizički razvoj", description: "Crta jednostavne oblike, samostalno koristi kašiku i viljušku, preskače prepreke." },
              { category: "Opservacija", description: "Razlikuje osnovne boje, prepoznaje brojeve do 5, ume da složi jednostavne slagalice." },
              { category: "Socijalno-emocionalni razvoj", description: "Igra se u grupi, pokazuje interesovanje za prijateljstva, izražava emocije kroz igru." },
              { category: "Govor i Jezik", description: "Koristi složenije rečenice, postavlja pitanja tipa 'zašto', imenuje poznate predmete i osobe." },
            ],
            concerns: "Ako dete ne može da koristi pribor za jelo, ne prepoznaje osnovne boje ili ne postavlja pitanja, obratite se stručnjaku za dečji razvoj.",
            generalTips: [
              "Podstičite dete da koristi pribor za jelo i učestvuje u porodičnim obrocima.",
              "Učite dete prepoznavanju boja i brojeva kroz svakodnevne aktivnosti.",
              "Ohrabrujte dete da postavlja pitanja i istražuje svet oko sebe."
            ],
            suggestedActivities: [
              "Igrajte se slaganja kockica ili slagalica kako biste razvili logičko razmišljanje.",
              "Pevajte pesmice koje uključuju brojeve i boje.",
              "Organizujte igre memorije sa karticama koje prikazuju različite oblike i boje."
            ]
          },
          {
            ageRange: "54-60 meseci",
            milestones: [
              { category: "Fizički razvoj", description: "Vozi tricikl, skače s obe noge, koristi makaze za sečenje papira." },
              { category: "Opservacija", description: "Razlikuje osnovne oblike i boje, prepoznaje brojeve do 10, ume da prepriča kratku priču." },
              { category: "Socijalno-emocionalni razvoj", description: "Razume pravila igre, pokazuje empatiju prema drugima, razvija osećaj pripadnosti grupi." },
              { category: "Govor i Jezik", description: "Priča jednostavne priče sa početkom, sredinom i krajem, koristi složenije rečenice." },
            ],
            concerns: "Ako dete ne može da vozi tricikl, ne prepoznaje brojeve ili ne može da ispriča jednostavnu priču, konsultujte se sa pedijatrom.",
            generalTips: [
              "Podstičite fizičku aktivnost kroz vožnju tricikla i igre na otvorenom.",
              "Učite dete prepoznavanju brojeva i oblika kroz igre i pesmice.",
              "Ohrabrujte dete da priča priče i izražava svoja osećanja rečima."
            ],
            suggestedActivities: [
              "Organizujte trke triciklima ili vožnju po poligonu.",
              "Igrajte se igara brojanja predmeta u kući ili prirodi.",
              "Čitajte zajedno priče i podstičite dete da prepriča sadržaj."
            ]
          },
          {
            ageRange: "60-66 meseci",
            milestones: [
              { category: "Fizički razvoj", description: "Preskače konopac, hvata i baca loptu precizno, kontroliše pokrete ruke pri crtanju." },
              { category: "Opservacija", description: "Razume osnovne koncepte vremena (juče, danas, sutra), zna redosled događaja." },
              { category: "Socijalno-emocionalni razvoj", description: "Razlikuje dobro i loše ponašanje, igra se sa vršnjacima uz poštovanje pravila." },
              { category: "Govor i Jezik", description: "Koristi bogat rečnik, razume priče i bajke, postavlja pitanja o uzrocima i posledicama." },
            ],


          },
          {
            ageRange: "66-72 meseci",
            milestones: [
              { category: "Fizički razvoj", description: "Hvata i baca loptu s preciznošću, skače na jednoj nozi, samostalno se oblači i zakopčava dugmad." },
              { category: "Opservacija", description: "Razlikuje osnovne geometrijske oblike, povezuje događaje u logičan niz." },
              { category: "Socijalno-emocionalni razvoj", description: "Počinje da razume i koristi dogovore u igri, izražava osećanja kroz igru i priče." },
              { category: "Govor i Jezik", description: "Razume osnovne pojmove pisanja i čitanja, koristi složenije rečenice i izraze." },
            ],
            concerns: "Ako dete ne može da hvata i baca loptu s preciznošću, ne prepoznaje osnovne geometrijske oblike ili ne koristi složenije rečenice, preporučuje se konsultacija sa pedijatrom.",
            generalTips: [
              "Podstičite dete da se samostalno oblači i vežba zakopčavanje dugmadi.",
              "Učite dete prepoznavanju i imenovanju geometrijskih oblika kroz svakodnevne aktivnosti.",
              "Ohrabrujte dete da izražava svoja osećanja kroz igru i priče."
            ],
            suggestedActivities: [
              "Igrajte se bacanja i hvatanja lopte kako biste poboljšali motoričke veštine.",
              "Koristite slagalice ili igre koje uključuju prepoznavanje oblika i boja.",
              "Čitajte zajedno priče i podstičite dete da prepriča sadržaj koristeći složene rečenice."
            ]
          },
          {
            ageRange: "72-78 meseci",
            milestones: [
              { category: "Fizički razvoj", description: "Vešto koristi makaze i olovku, preskače prepreke, hoda unazad bez problema." },
              { category: "Opservacija", description: "Razlikuje leve i desne strane, prepoznaje više i manje predmete u grupama." },
              { category: "Socijalno-emocionalni razvoj", description: "Pokazuje interesovanje za grupne aktivnosti, razume koncept deljenja i saradnje." },
              { category: "Govor i Jezik", description: "Priča priče sa detaljima, koristi rečenice sa složenim strukturama, prepoznaje slova i brojeve." },
            ],
            concerns: "Ako dete ne može vešto da koristi makaze i olovku, ne razlikuje leve i desne strane ili ne prepoznaje slova i brojeve, preporučuje se konsultacija sa pedijatrom.",
            generalTips: [
              "Podstičite dete da koristi makaze i olovku kroz kreativne aktivnosti poput sečenja i crtanja.",
              "Učite dete razlikovanju leve i desne strane kroz igre i pesmice.",
              "Ohrabrujte dete da učestvuje u grupnim aktivnostima kako bi razvilo socijalne veštine."
            ],
            suggestedActivities: [
              "Organizujte igre koje uključuju preskakanje prepreka kako biste poboljšali koordinaciju.",
              "Koristite igre memorije koje uključuju prepoznavanje slova i brojeva.",
              "Pružite detetu priliku da učestvuje u timskim sportovima ili grupnim igrama kako bi razvilo osećaj saradnje."
            ]
          }
        ]
      };
    }
  };
</script>


  
<style scoped lang="scss">

@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.development-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 30px;
  max-width: 900px;
  margin: 0 auto;
  background-color: #f4f7fb;
  font-family: 'Roboto', sans-serif;
}

.development-card {
  background: #fff;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 30px rgba(0, 0, 0, 0.15);
    background-color: #f9fbfd;
  }

  h2 {
    font-size: 2.1em;
    color: #2c3e50;
    margin-bottom: 20px;
    text-align: center;
    font-weight: 700;
  }

  &.period-0 { background-color: #e8f4fd; }
  &.period-1 { background-color: #eafaf1; }
  &.period-2 { background-color: #fff4e6; }
  &.period-3 { background-color: #fdecea; }
}

.development-section {
  margin-bottom: 25px;
  padding: 20px;
  border-left: 6px solid #5dade2;
  border-radius: 10px;
  background-color: #fefefe;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  &:hover {
    background-color: #edf6fd;
  }

  h3 {
    font-size: 1.25em;
    font-weight: 600;
    margin-bottom: 10px;
    color: #2980b9;
  }

  p, ul {
    font-size: 1.05em;
    line-height: 1.7;
    color: #444;
  }

  ul {
    padding-left: 20px;
    list-style: disc;
  }
}

/* Dinamičke klase po kategorijama */
.fizički-razvoj {
  border-left-color: #4caf50;
  h3 { color: #2e7d32; }
}

.govor-i-jezik,
.govor-i-jezik {
  border-left-color: #2196f3;
  h3 { color: #1565c0; }
}

.socijalno-emocionalni-razvoj {
  border-left-color: #f06292;
  h3 { color: #ad1457; }
}

.opservacija {
  border-left-color: #ffb74d;
  h3 { color: #ef6c00; }
}

.concers,
.general-tips,
.suggested-activities {
  border-left-color: #9e9e9e;
  h3 { color: #616161; }
}

.development-advice {
  padding: 20px;
  border-left: 6px solid #2e86c1;
  background-color: #eaf4fc;
  border-radius: 10px;
  margin-bottom: 25px;

  h3 {
    color: #21618c;
    font-weight: 600;
    font-size: 1.2em;
    margin-bottom: 8px;
  }

  p {
    font-size: 1.05em;
    line-height: 1.7;
    color: #2e4053;
  }
}

@media (max-width: 768px) {
  .development-container {
    padding: 15px;
  }

  .development-card {
    padding: 20px;
  }

  .development-section,
  .development-advice {
    padding: 15px;
  }

  h2 {
    font-size: 1.6em;
  }

  h3 {
    font-size: 1.1em;
  }

  p, ul {
    font-size: 0.95em;
  }
}


</style>