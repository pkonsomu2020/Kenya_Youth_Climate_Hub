import type { Overrides } from "../localize";
import type { successStories } from "../successStories";

type Story = (typeof successStories)[number];

export const successStoriesI18n: Overrides<Story> = {
  sw: {
    "joan-ndanu": {
      tag: "Nishati Jadidifu",
      excerpt: "Inawapa wafugaji wa ng'ombe wa maziwa mitambo ya biogesi inayogeuza kinyesi cha mifugo kuwa gesi safi ya kupikia na mbolea asilia.",
      fullText: "CarBIO inawapa wafugaji wa ng'ombe wa maziwa nchini Kenya mitambo ya biogesi inayogeuza kinyesi cha mifugo kuwa gesi safi ya kupikia na mbolea asilia, hivyo kupunguza uzalishaji wa methane na matumizi ya kuni. Wakichochewa na gridi ndogo ya nishati ya jua huko Narok, waliona uwezo wa nishati jadidifu kubadilisha maisha vijijini. Wanajaribu mfano wa mtambo uliobuniwa kwa maoni ya wakulima pamoja na mfumo wa kidijitali wa kufuatilia upunguzaji wa kaboni, kwa msaada wa jukwaa la Yoma ambako wamepata ujuzi wa teknolojia.",
    },
    "wesley-njenga": {
      tag: "Nishati Jadidifu",
      excerpt: "Inakabiliana na uchafuzi wa hewa kwa kutumia Eco Pure Hybrid Scrubber, inayochuja moshi wenye sumu huku ikibadilisha taka kuwa rasilimali.",
      fullText: "Darubini ya Afya, kupitia Eco Pure Hybrid Scrubber, inakabiliana na 'muuaji wa kimya' wa Afrika, yaani uchafuzi wa hewa, kwa mfumo unaochuja moshi wenye sumu kutoka kwenye vichomea taka huku ukibadilisha taka kuwa rasilimali zenye manufaa. Ubunifu huu, uliotokana na hali halisi ya jamii ambako magonjwa ya kupumua ni ya kawaida, unachanganya uchujaji wa majimaji na ukavu ili kunasa vichafuzi, kunasa joto la taka kwa ajili ya nishati, na kurejeleza kaboni.",
    },
    "violet-ochieng": {
      tag: "Maji, Usafi na Afya (WASH)",
      excerpt: "Nepi za kitambaa zinazotengenezwa nchini na kutumika tena, zinazopunguza gharama za familia na kukuza jamii safi.",
      fullText: "Veeklture inakabiliana na changamoto zote mbili kwa ubunifu rahisi lakini wenye nguvu: nepi za kitambaa zinazotengenezwa nchini na kutumika tena, huko Kibera na katika jamii nyingine nyingi kote Kenya. Zinafulika na kudumu, na kila nepi inaweza kutumika hadi miaka mitatu kwa mtoto mmoja, hivyo kupunguza gharama za nepi za familia kwa hadi asilimia 70. Tofauti na nepi za kutupwa, hazibaki kwenye mazingira kwa karne nyingi; badala yake, zinasaidia kupunguza taka za plastiki na kukuza jamii safi na zenye afya zaidi.",
    },
    "kevine-otieno": {
      tag: "Nishati Jadidifu",
      excerpt: "Inabadilisha kinyesi cha binadamu na mifugo kuwa gesi safi ya kupikia na mbolea asilia yenye virutubisho.",
      fullText: "Greenium Energy Limited ni kampuni ya nishati jadidifu inayobadilisha kinyesi cha binadamu na mifugo kuwa gesi safi ya kupikia na mbolea asilia yenye virutubisho. Lengo lake ni kuharakisha mpito kuelekea nishati safi huku ikiboresha afya, kulinda mazingira na kubuni ajira.",
    },
    "miriam-mukami": {
      tag: "Nishati Jadidifu",
      excerpt: "Inaunganisha utunzaji wa ngozi na uendelevu kwa kubadilisha taka za shambani kuwa bidhaa za ngozi zenye virutubisho.",
      fullText: "Touché by Kami, inayoongozwa na Mkurugenzi Mtendaji Miriam Mukami, inabadilisha dhana ya urembo kwa kuunganisha utunzaji wa ngozi na uendelevu pamoja na uwezeshaji wa jamii. Chapa hii inabadilisha taka za shambani kama matunda yaliyoiva kupita kiasi, makumbi ya nazi, magunia ya viazi na maganda ya nanasi kuwa bidhaa za ngozi zenye virutubisho, vifungashio rafiki kwa mazingira na bidhaa asilia za kutunza mwili. Chini ya uongozi wa Miriam, Touché by Kami inakabiliana na hasara za baada ya mavuno, inabuni ajira, na inathibitisha kuwa taka zinaweza kuwa maajabu. Kwa kila bidhaa, kampuni hii inaleta si tu lishe asilia kwa ngozi bali pia matumaini na matokeo kwa jamii, ikiishi kweli maono yake ya 'urembo wenye kusudi.'",
    },
  },
  fr: {
    "joan-ndanu": {
      tag: "Énergies renouvelables",
      excerpt: "Équipe les éleveurs laitiers de digesteurs de biogaz qui transforment les déjections animales en gaz de cuisson propre et en biofertilisant.",
      fullText: "CarBIO équipe les éleveurs laitiers kényans de digesteurs de biogaz qui transforment les déjections animales en gaz de cuisson propre et en biofertilisant, réduisant les émissions de méthane et la consommation de bois de chauffe. Inspirés par un mini-réseau solaire à Narok, ils ont vu le potentiel des énergies renouvelables pour transformer la vie rurale. Ils testent un prototype de digesteur conçu avec les éleveurs ainsi qu'un système numérique de suivi des réductions de carbone, avec le soutien de la plateforme Yoma, où ils ont acquis des compétences technologiques.",
    },
    "wesley-njenga": {
      tag: "Énergies renouvelables",
      excerpt: "Lutte contre la pollution de l'air avec l'Eco Pure Hybrid Scrubber, qui filtre les émissions toxiques tout en valorisant les déchets.",
      fullText: "Grâce à l'Eco Pure Hybrid Scrubber, Darubini ya Afya s'attaque au « tueur silencieux » de l'Afrique, la pollution de l'air, avec un système qui filtre les émissions toxiques des incinérateurs tout en transformant les déchets en ressources utiles. Née des réalités de communautés où les maladies respiratoires sont fréquentes, l'innovation combine lavage humide et filtration sèche pour piéger les polluants, récupérer la chaleur perdue pour produire de l'énergie et recycler le carbone.",
    },
    "violet-ochieng": {
      tag: "Eau, assainissement et hygiène (WASH)",
      excerpt: "Des couches lavables fabriquées localement, qui réduisent les dépenses des ménages et favorisent des communautés plus propres.",
      fullText: "Veeklture répond à ces deux problèmes avec une innovation simple et puissante : des couches en tissu lavables, fabriquées localement à Kibera et dans de nombreuses autres communautés du Kenya. Lavables et durables, chaque couche peut servir jusqu'à trois ans par enfant, réduisant jusqu'à 70 % les dépenses des ménages en couches. Contrairement aux couches jetables, elles ne persistent pas des siècles dans l'environnement ; elles contribuent au contraire à réduire les déchets plastiques et à rendre les communautés plus propres et plus saines.",
    },
    "kevine-otieno": {
      tag: "Énergies renouvelables",
      excerpt: "Transforme les déchets humains et animaux en gaz de cuisson propre et en engrais organique riche en nutriments.",
      fullText: "Greenium Energy Limited est une entreprise d'énergie renouvelable qui transforme les déchets humains et animaux en gaz de cuisson propre et en engrais organique riche en nutriments. Sa mission : accélérer la transition vers une énergie propre tout en améliorant la santé, en protégeant l'environnement et en créant des emplois.",
    },
    "miriam-mukami": {
      tag: "Énergies renouvelables",
      excerpt: "Allie soins de la peau et durabilité en transformant les déchets agricoles en produits de soin riches en nutriments.",
      fullText: "Touché by Kami, dirigée par sa PDG Miriam Mukami, réinvente la beauté en alliant soins de la peau, durabilité et autonomisation des communautés. La marque transforme des déchets agricoles comme les fruits trop mûrs, les coques de noix de coco, les sacs de pommes de terre et les peaux d'ananas en produits de soin riches en nutriments, en emballages écologiques et en soins corporels biologiques. Sous la direction de Miriam, Touché by Kami lutte contre les pertes après récolte, crée des emplois et prouve que les déchets peuvent devenir des merveilles. Avec chaque produit, l'entreprise apporte non seulement une nutrition naturelle à la peau, mais aussi de l'espoir et un impact pour les communautés, incarnant pleinement sa vision d'une « beauté qui a du sens ».",
    },
  },
};
