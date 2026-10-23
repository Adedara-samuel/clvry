export const INTRO_KEY = "clvry-intro";

/** Inline <head> snippet: skip the intro if it already played this session. */
export const introInitScript = `try{if(sessionStorage.getItem(${JSON.stringify(INTRO_KEY)}))document.documentElement.dataset.intro="seen"}catch(e){}`;
