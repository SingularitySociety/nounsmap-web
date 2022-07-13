<template>
  <div
    class="fixed grid grid-rows-5 grid-cols-5 grid-flow-col items-stretch h-screen w-screen z-50 justify-items-center bg-black bg-opacity-50"
    v-if="nftRequestPhoto?.photoId"
  >
    <div
      class="col-start-4 row-span-1 col-span-1 flex justify-center items-center"
      @click="close"
    >
      <i class="text-6xl material-icons text-white mr-2">cancel</i>
    </div>
    <div
      class="row-start-2 col-start-2 col-span-3 row-span-3 justify-center items-center font-mono"
      v-if="isShow"
    >
      <div class="flex flex-col items-stretch md:items-center">
        <span class="my-4 text-2xl text-white">
          {{ $t("message.NFTuploadTitle") }}
        </span>
        <span class="my-4 text-xl text-white">
          {{ $t("message.NFTuploadDetail") }}
        </span>
        <span class="sr-only">{{ $t("message.selectImage") }}</span>
        <input
          type="file"
          ref="fileInput"
          @input="pickFile"
          class="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-1 file:text-sm file:font-semibold file:bg-white file:text-gray-800 hover:file:bg-gray-100"
        />
        <div class="shrink-0 py-2" v-if="previewImage">
          <img
            ref="imageRef"
            class="h-40 object-cover rounded-md"
            :src="previewImage"
            @load="onImageLoad"
            alt="selected photo"
          />
        </div>
        <div class="flex flex-row items-stretch items-left m-4">
          <span class="text-xl text-white mr-2">
            {{ $t("label.name") }} :
          </span>
          <input
            type="text"
            ref="nameRef"
            maxlength="128"
            minlength="1"
            class="text-sm my-2 text-slate-500 rounded-sm border-1 text-sm bg-white file:text-gray-800 hover:bg-gray-100"
          />
        </div>
        <div class="flex flex-row items-stretch items-left m-4">
          <span class="mt-8 text-xl text-white mr-2">
            {{ $t("label.description") }} :
          </span>
          <input
            type="text"
            ref="descRef"
            maxlength="512"
            minlength="1"
            class="text-sm my-2 text-slate-500 rounded-sm border-1 text-sm bg-white file:text-gray-800 hover:bg-gray-100"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { useStore } from "vuex";
import { nounsMapConfig } from "@/config/project";
import { User } from "firebase/auth";
import {
  defineComponent,
  ref,
  computed,
  WritableComputedRef,
  watch,
} from "vue";
import router from "@/router";
import { PhotoPubData } from "@/models/photo";
import exifr from "exifr";
import heic2any from "heic2any";
import { db } from "@/utils/firebase";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  DocumentData,
  collection,
} from "firebase/firestore";
export default defineComponent({
  emits: {},
  setup() {
    const user = computed<User>(() => store.state.user);
    const isShow = ref<boolean>();
    const fileInput = ref();
    const previewImage = ref();
    const imageRef = ref();
    const store = useStore();
    const nftRequestPhoto: WritableComputedRef<PhotoPubData | null> = computed({
      get: () => store.state.nftRequestPhoto as PhotoPubData,
      set: (val) => store.commit("setNftRequestPhoto", val),
    });
    const pickFile = async () => {
      const files = fileInput.value.files;
      console.log("picked", files);
      if (files && files[0]) {
        if (/\.(jpe?g|png|gif)$/i.test(files[0].name)) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            previewImage.value = e?.target?.result;
          };
          reader.readAsDataURL(files[0]);
        } else if (/\.(heic)$/i.test(files[0].name)) {
          const blob = await heic2any({
            blob: files[0],
            toType: "image/jpeg",
            quality: 0.94,
          });
          previewImage.value = URL.createObjectURL(blob as Blob);
        } else {
          fileInput.value.value = "";
          previewImage.value = "";
        }
      }
    };
    const onImageLoad = async () => {
      if (!imageRef.value || !fileInput.value || !fileInput.value.files[0]) {
        console.error(imageRef.value, fileInput.value);
        return false;
      }
    };
    const close = () => {
      nftRequestPhoto.value = null;
    };
    watch(nftRequestPhoto, async () => {
      console.log(nftRequestPhoto.value);
      if (nftRequestPhoto.value) {
        const photoId = nftRequestPhoto.value.photoId;
        const photoDoc = await getDoc(
          doc(db, `users/${user.value.uid}/public_photos/${photoId}`)
        );
        if (photoDoc.exists()) {
          console.log(photoDoc.data());
          const { iconURL, photoURL, lat, lng, zoom, original_name } =
            photoDoc.data();
          //default icon size is 80, 30
          isShow.value = true;
        } else {
          console.log("wrongUser", user.value?.uid);
          close();
        }
      }
    });

    const nftRequest = () => {
      console.log("XXXX need to implment request NFT ");
      //File確認
      //original 画像Upload
      /*
      const _pid = doc(collection(db, "hoge")).id;
      const storage_path = `images/users/${_uid}/public_photos/${_pid}/original.jpg`;
      const photoURL = (await uploadFile(
        photoLocal.value.resizedBlob,
        storage_path
      )) as string;
      pins["upload"]?.update({ photoURL });
      pins["upload"]?.showPhoto();
      const pdata = generateNewPhotoData(
        _pid,
        photoURL,
        photoLocal.value.file.name,
        storage_path,
        lat,
        lng,
        zoom,
        iconId,
        iconURL
      );
      await setDoc(doc(db, `users/${_uid}/public_photos/${_pid}`), pdata);
      // eslint-disable-next-line
      const { data }: any = await photoPosted({
        photoId: _pid,
        lat,
        lng,
        zoom,
      });
      */
      //photo meta data 更新
      // backend へ nft reqest送信
    };
    return {
      isShow,
      fileInput,
      previewImage,
      nounsMapConfig,
      nftRequestPhoto,
      pickFile,
      close,
      nftRequest,
    };
  },
});
</script>
