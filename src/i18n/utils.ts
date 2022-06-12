import { App, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, Router } from "vue-router";

export const i18nUtils = (app: App) => {
  app.config.globalProperties.localizedUrl = (path: string) => {
    const lang = app.config.globalProperties.$route.params?.lang;
    if (lang) {
      return `/${lang}` + path;
    }
    return path;
  };
};

export const getLocalePath = (router: Router, path: string) => {
  const lang = router.currentRoute.value.params?.lang;
  if (lang) {
    return `/${lang}` + path;
  }
  return path;
};

export const getLocaleName = (router: Router, name: string) => {
  const lang = router.currentRoute.value.params.lang;
  if (lang) {
    return "loc" + name;
  }
  return "noloc" + name;
};

export const useI18nParam = () => {
  const route = useRoute();
  const i18n = useI18n();

  const lang = computed(() => {
    return (route.params.lang as string) || "en";
  });
  watch(lang, () => {
    i18n.locale.value = lang.value;
  });
  i18n.locale.value = lang.value;
};

export const getBrowserLocale = (options = {}) => {
  const defaultOptions = { countryCodeOnly: false };
  const opt = { ...defaultOptions, ...options };
  const navigatorLocale =
    navigator.languages !== undefined
      ? navigator.languages[0]
      : navigator.language;
  if (!navigatorLocale) {
    return undefined;
  }
  const trimmedLocale = opt.countryCodeOnly
    ? navigatorLocale.trim().split(/-|_/)[0]
    : navigatorLocale.trim();
  return trimmedLocale;
};
