<template>
  <div>
    <select @change="updateValue">
      <option
        v-for="(option, index) in languages"
        :value="option"
        :key="index"
        :selected="option == selectedValue ? true : false"
      >
        {{ $t("languages." + option) }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import { languages } from "@/i18n/index";
import { getBrowserLocale } from "@/i18n/utils";

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const i18n = useI18n();

    const selectedValue = ref(i18n.locale.value);

    onMounted(() => {
      if (route.params.lang) {
        return;
      }
      //make default lang as browser setting
      const blocale = getBrowserLocale({ countryCodeOnly: true });
      if (blocale) {
        const locale = languages.includes(blocale) ? blocale : "en";
        console.log(blocale, locale, route.params);
        if (locale) {
          i18n.locale.value = locale;
        }
      }
    });

    const updateValue = (value: { target: HTMLSelectElement }) => {
      const basePath = (() => {
        if (route.params.lang) {
          return route.path.slice(route.params.lang.length + 1);
        }
        return route.path;
      })();
      const newPath = `/${value.target.value}${basePath}`;
      if (newPath !== route.path) {
        router.push(newPath);
      }
    };
    return {
      languages,
      selectedValue,
      updateValue,
    };
  },
});
</script>
