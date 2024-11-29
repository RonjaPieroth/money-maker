export type Wisdom = {
    content: string[],
    source?: string
}

const wisdom: Wisdom[] = [
    {content: ["Wer den Tag im Bett verpennt,", "wird vom Leben abgehängt."], source: "nicht Lindner"},
    {content: ["In guten wie in schlechten Zeiten:", "man muss sich immer hocharbeiten."], source: "nicht Lindner"},
    {content: ["Verlass dich bloß nicht auf den Staat,", "arbeite stattdessen hart."], source: "nicht Lindner"},
    {content: ["Niemand muss in Armut leben..", "du musst dir einfach Mühe geben."], source: "nicht Lindner"},
    {content: ["Nicht Freundschaft, Kunst, nicht Fantasie,", "im Leben gehts um Hierachie."], source: "nicht Lindner"},
    {content: ["Sage zur Gewerkschaft nein,", "du willst nicht Kommunistin sein."], source: "nicht Lindner"},
    {content: ["Viele Chancen sich vermasselt,", "wer nicht jede Stunde husselt."], source: "nicht Lindner"},
    {content: ["Steige jetzt ein oder nie,", "kaufe dir ein NFT!"], source: "nicht Lindner"},
    {content: ["Der Kunde wartet schon."], source: "Lindner 1997"},
    {content: ["Der eine wartet, dass die Zeit sich wandelt,", "der andre packt sie an und handelt"], source: "Lindner 1997"},
    {content: ["Rann an die Arbeit, Arbeit bewältigen.", "Probleme sind nur dornige Chancen."], source: "Lindner 1997"},
    {content: ["Auf dem Weg zum Erfolg gibt es keinen Aufzug.", "Man muss schon die Treppen benutzen."], source: "Lindner 1997"}
];

export function getRandomWisdom(): Wisdom {
    let index = Math.floor(Math.random() * wisdom.length);
    return wisdom[index];
}