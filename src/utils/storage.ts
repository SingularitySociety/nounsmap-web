import {
  getStorage,
  ref,
  uploadBytesResumable,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

export const uploadFile = (
  file: ArrayBuffer | File,
  path: string,
  meta: string | undefined
) => {
  return new Promise<string>((resolve, rejected) => {
    const storage = getStorage();
    const storageRef = ref(storage, path);
    const uploadTask = meta
      ? uploadBytesResumable(storageRef, file, {
          contentType: `image/${meta}`,
        })
      : uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(snapshot);
      },
      (err) => {
        rejected(err);
      },
      async () => {
        // const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
        //resolve(downloadURL);
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log('File available at', downloadURL);
          resolve(downloadURL);
        });
      }
    );
  });
};

export const uploadSVG = (data: string, path: string): Promise<string> => {
  return new Promise((resolve) => {
    const storage = getStorage();
    const storageRef = ref(storage, path);
    const metadata = {
      contentType: " image/svg+xml",
    };
    uploadString(storageRef, data, "data_url", metadata).then((snapshot) => {
      console.log(snapshot);
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        // console.log('File available at', downloadURL);
        resolve(downloadURL);
      });
    });
  });
};

export const getFileDownloadURL = async (path: string) => {
  const storage = getStorage();
  const storageRef = ref(storage, path);
  try {
    return await getDownloadURL(storageRef);
  } catch (reason) {
    console.error(reason);
    return "";
  }
};
