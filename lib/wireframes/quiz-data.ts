export type QuizQ = { q: string; o: [string, string, string, string]; a: number; why: string };

export const QUIZ_TITLE = "Malta, the Blitz and the wider war";

export const QUIZ: QuizQ[] = [
  {
    q: "Which fighter arrived on Malta in March 1942 and changed the air battle over the island?",
    o: ["Hawker Hurricane Mk II", "Supermarine Spitfire Mk V", "Gloster Gladiator", "Bristol Beaufighter"],
    a: 1,
    why: "The first Spitfires flew in from HMS Eagle on 7 March 1942, and they turned the air battle over the island.",
  },
  {
    q: "Which convoy operation of August 1942 got five merchant ships and the tanker Ohio into Grand Harbour?",
    o: ["Operation Pedestal", "Operation Torch", "Operation Husky", "Operation Harpoon"],
    a: 0,
    why: "Operation Pedestal, 10 to 15 August 1942. Of fourteen merchant ships, five reached Malta, with the crippled Ohio lashed between destroyers.",
  },
  {
    q: "In which year did the Battle of Britain take place?",
    o: ["1939", "1940", "1941", "1942"],
    a: 1,
    why: "The Battle of Britain was fought over the summer and autumn of 1940.",
  },
  {
    q: "Who led RAF Fighter Command during the Battle of Britain?",
    o: ["Arthur Harris", "Hugh Trenchard", "Hugh Dowding", "Charles Portal"],
    a: 2,
    why: "Air Chief Marshal Sir Hugh Dowding built the integrated system of radar, observers and controllers that won the battle.",
  },
  {
    q: "Which airfield was the main Spitfire base on Malta in summer 1942?",
    o: ["Luqa", "Hal Far", "Takali", "Safi"],
    a: 2,
    why: "Takali was the main fighter airfield. Luqa housed bombers and reconnaissance aircraft, and Hal Far the Fleet Air Arm.",
  },
  {
    q: "Which award was given to the entire island of Malta by King George VI in April 1942?",
    o: ["The Victoria Cross", "The Military Cross", "The George Cross", "The Order of Merit"],
    a: 2,
    why: "George VI awarded the George Cross to the people of Malta on 15 April 1942 for their courage under siege.",
  },
  {
    q: "What was the name of the Allied invasion of Normandy on 6 June 1944?",
    o: ["Operation Overlord", "Operation Market Garden", "Operation Barbarossa", "Operation Dynamo"],
    a: 0,
    why: "Overlord was the overall operation. Neptune was the naval assault phase of it.",
  },
  {
    q: "Which battle, ending in February 1943, marked a turning point on the Eastern Front?",
    o: ["Kursk", "Moscow", "Stalingrad", "Leningrad"],
    a: 2,
    why: "The German Sixth Army surrendered at Stalingrad at the start of February 1943, a catastrophic defeat for the Wehrmacht.",
  },
];
