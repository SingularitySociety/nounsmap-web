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
      <div
        v-if="errorAlready"
        class="flex flex-col items-stretch md:items-center"
      >
        <span class="my-4 text-2xl text-white">
          {{ $t("message.NFTuploadTitle") }}
        </span>
        <span class="my-4 text-xl text-white">
          {{ $t("message.NFTAlreadyRequested") }}
        </span>
      </div>
      <div v-else class="flex flex-col items-stretch md:items-center">
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
        <span class="text-base text-red-400 font-bold ml-2" v-if="fileError">
          {{ $t("message.nftFileError") }}
        </span>
        <div class="shrink-0 py-2" v-if="previewImage">
          <img
            ref="imageRef"
            class="h-40 object-cover rounded-md"
            :src="previewImage"
            alt="selected photo"
          />
        </div>
        <div class="flex flex-row items-left m-4">
          <span class="text-xl text-white mr-2"> {{ $t("label.name") }}: </span>
          <input
            type="text"
            ref="nameRef"
            maxlength="128"
            minlength="1"
            class="text-sm my-2 text-slate-500 rounded-sm border-1 text-sm bg-white file:text-gray-800 hover:bg-gray-100"
          />
          <span class="text-base text-red-400 font-bold ml-2" v-if="nameError">
            {{ $t("message.nameError") }}
          </span>
        </div>
        <div class="flex flex-row items-left m-4">
          <span class="text-xl text-white mr-2">
            {{ $t("label.description") }}:
          </span>
          <input
            type="text"
            ref="descRef"
            maxlength="512"
            minlength="1"
            class="text-sm my-2 text-slate-500 rounded-sm border-1 text-sm bg-white file:text-gray-800 hover:bg-gray-100"
          />
          <span class="text-base text-red-400 font-bold ml-2" v-if="descError">
            {{ $t("message.descError") }}
          </span>
        </div>
        <button
          v-if="!processing"
          @click="nftRequest"
          class="bg-green-800 hover:bg-green-100 text-white md:w-2/3 justify-center font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        >
          {{ $t("function.requestNFT") }}
        </button>
        <button
          v-else
          type="button"
          class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          disabled
        >
          <i class="animate-spin material-icons text-lg text-op-teal mr-2"
            >schedule</i
          >
          {{ $t("message.processing") }}
        </button>
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
import { PhotoPubData } from "@/models/photo";
import { uploadFile } from "@/utils/storage";
import heic2any from "heic2any";
import { db } from "@/utils/firebase";
import { doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { photoNFTPosted } from "@/utils/functions";

export default defineComponent({
  emits: {},
  setup() {
    const user = computed<User>(() => store.state.user);
    const isShow = ref<boolean>(false);
    const errorAlready = ref<boolean>(false);
    const fileInput = ref();
    const fileError = ref<boolean>(false);
    const previewImage = ref();
    const nameRef = ref();
    const nameError = ref<boolean>(false);
    const descRef = ref();
    const descError = ref<boolean>(false);
    const store = useStore();
    const processing = ref<boolean>(false);
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

    const close = () => {
      nftRequestPhoto.value = null;
    };
    watch(nftRequestPhoto, async () => {
      console.log(nftRequestPhoto.value);
      if (nftRequestPhoto.value) {
        //check request is from user(owner) or not.
        const photoId = nftRequestPhoto.value.photoId;
        const photoDoc = await getDoc(
          doc(db, `users/${user.value.uid}/public_photos/${photoId}`)
        );
        if (photoDoc.exists()) {
          console.log(photoDoc.data());
          //default icon size is 80, 30
          const rphotoDoc = await getDoc(
            doc(db, `nft_request_photos/${photoId}`)
          );
          if (rphotoDoc.exists()) {
            errorAlready.value = true;
          }
          isShow.value = true;
        } else {
          console.log("wrongUser", user.value?.uid);
          close();
        }
      }
    });

    const nftRequest = async () => {
      if (!nftRequestPhoto.value) {
        return;
      }
      const photoId = nftRequestPhoto.value.photoId;
      console.log("request NFT ", photoId);

      //Input確認
      const file = fileInput.value.files[0];
      console.log(file);
      fileError.value = file ? false : true;
      nameError.value = nameRef.value.value ? false : true;
      descError.value = descRef.value.value ? false : true;
      if (fileError.value || descError.value || nameError.value) {
        return;
      }

      //original 画像Upload
      processing.value = true;
      try {
        const storage_path = `images/users/${user.value.uid}/public_photos/${photoId}/nft_original.jpg`;
        const photoURL = (await uploadFile(
          fileInput.value.files[0],
          storage_path,
          "jpeg"
        )) as string;
        console.log({ photoURL });
        //photo meta data 更新
        await updateDoc(
          doc(db, `users/${user.value.uid}/public_photos/${photoId}`),
          {
            original_name: file.name,
            title: nameRef.value.value,
            description: descRef.value.value,
            updatedAt: serverTimestamp(),
          }
        );
        // backend へ nft reqest送信
        const ret = await photoNFTPosted({ photoId });
        console.log(ret);
        processing.value = false;
        close();
      } catch (e: unknown) {
        processing.value = false;
      }
    };
    return {
      isShow,
      errorAlready,
      fileInput,
      fileError,
      previewImage,
      nameRef,
      nameError,
      descRef,
      descError,
      nounsMapConfig,
      nftRequestPhoto,
      processing,
      pickFile,
      close,
      nftRequest,
    };
  },
});
</script>
