// The consent contract shared with aidevs.pt, which serves these docs: the same storage key,
// events and Google consent mode defaults, so one choice covers the whole site.
export const CONSENT_STORAGE_KEY = "consent.v1";
export const CONSENT_OPEN_EVENT = "open-cookie-settings";
export const CONSENT_UPDATED_EVENT = "consent-updated";

export type ConsentChoice = { analytics: boolean; marketing: boolean };

export function readConsent(): ConsentChoice | null {
  try {
    const stored = JSON.parse(
      localStorage.getItem(CONSENT_STORAGE_KEY) ?? "null",
    );
    if (
      stored &&
      typeof stored.analytics === "boolean" &&
      typeof stored.marketing === "boolean"
    )
      return { analytics: stored.analytics, marketing: stored.marketing };
  } catch {}
  return null;
}

export function googleConsent({ analytics, marketing }: ConsentChoice) {
  const value = (on: boolean) => (on ? "granted" : "denied");
  return {
    analytics_storage: value(analytics),
    ad_storage: value(marketing),
    ad_user_data: value(marketing),
    ad_personalization: value(marketing),
  };
}

/** A JSON string literal that can't end an inline <script> or break its line. */
const scriptString = (value: string) =>
  JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\//g, "\\u002f")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

/** Runs first in <head>, before the edge tag gateway adds Google's tag. */
export const consentDefaultsScript = `window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};(function(){var a=false,m=false,s=false;try{var c=JSON.parse(localStorage.getItem(${scriptString(CONSENT_STORAGE_KEY)}));if(c&&typeof c.analytics==='boolean'&&typeof c.marketing==='boolean'){a=c.analytics;m=c.marketing;s=true}}catch(e){}var g=function(v){return v?'granted':'denied'};gtag('consent','default',{analytics_storage:g(a),ad_storage:g(m),ad_user_data:g(m),ad_personalization:g(m),functionality_storage:'granted',security_storage:'granted',wait_for_update:s?0:500});gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',true)})();`;

/** OpenAI's ads pixel, told the stored marketing choice before it starts. */
export const openaiPixelScript = (pixelId: string) =>
  `!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");var c=false;try{var s=JSON.parse(localStorage.getItem(${scriptString(CONSENT_STORAGE_KEY)}));c=!!s&&s.marketing===true}catch(e){}oaiq("consent",c);oaiq("init",{pixelId:${scriptString(pixelId)}});`;
