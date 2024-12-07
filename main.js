let isEncryptionMode = true;

// tombol switch
document.getElementById("switch").addEventListener("click", function (event) {
  //   event.preventDefault();
  const encryptionTextarea = document.getElementById("encryption");
  const decryptionTextarea = document.getElementById("decryption");

  encryptionTextarea.value = "";
  decryptionTextarea.value = "";
  document.getElementById("matrix-00").value = "";
  document.getElementById("matrix-01").value = "";
  document.getElementById("matrix-10").value = "";
  document.getElementById("matrix-11").value = "";

  encryptionTextarea.disabled = isEncryptionMode;
  decryptionTextarea.disabled = !isEncryptionMode;

  isEncryptionMode = !isEncryptionMode;
});

// inisiasi ascii
const asciiMap = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
  J: 9,
  K: 10,
  L: 11,
  M: 12,
  N: 13,
  O: 14,
  P: 15,
  Q: 16,
  R: 17,
  S: 18,
  T: 19,
  U: 20,
  V: 21,
  W: 22,
  X: 23,
  Y: 24,
  Z: 25,
};
const reverseAsciiMap = Object.fromEntries(
  Object.entries(asciiMap).map(([k, v]) => [v, k])
);

//mhnghitung modular inverse
function modInverse(a, m) {
  a = ((a % m) + m) % m;
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) return x;
    console.log(x);
  }
  return 1;
}

// Enkripsi teks
function encrypt() {
  const message = document.getElementById("encryption").value.toUpperCase();
  const keyInput = getKeyMatrix();
  if (!keyInput) return;

  const paddedMessage = message + "X".repeat((2 - (message.length % 2)) % 2);
  const messageNumbers = [...paddedMessage].map((char) => asciiMap[char]);

  const encryptedNumbers = [];
  for (let i = 0; i < messageNumbers.length; i += 2) {
    const chunk = messageNumbers.slice(i, i + 2);
    // console.log(chunk);
    const result = matrixMultiply(keyInput, chunk);
    encryptedNumbers.push(...result);
    console.log(keyInput + "*" + chunk + ":" + result);
  }

  const encryptedMessage = encryptedNumbers
    .map((num) => reverseAsciiMap[num])
    .join("");
  document.getElementById("decryption").value = encryptedMessage;
}

// dekripsi teks
function decrypt() {
  const message = document.getElementById("decryption").value.toUpperCase();
  const keyInput = getKeyMatrix();
  if (!keyInput) return;

  const determinant =
    (keyInput[0][0] * keyInput[1][1] - keyInput[0][1] * keyInput[1][0]) % 26;
  if (determinant === 0) {
    alert("Key matrix is not invertible.");
    return;
  }

  const invDet = modInverse(determinant, 26);
  const inverseKey = calculateInverseMatrix(keyInput, invDet);

  const messageNumbers = [...message].map((char) => asciiMap[char]);
  const decryptedNumbers = [];
  for (let i = 0; i < messageNumbers.length; i += 2) {
    const chunk = messageNumbers.slice(i, i + 2);
    const result = matrixMultiply(inverseKey, chunk);
    decryptedNumbers.push(...result);
    console.log(result);
  }

  const decryptedMessage = decryptedNumbers
    .map((num) => reverseAsciiMap[num])
    .join("");
  document.getElementById("encryption").value = decryptedMessage;
}

function getKeyMatrix() {
  const keyInput = [
    document.getElementById("matrix-00").value,
    document.getElementById("matrix-01").value,
    document.getElementById("matrix-10").value,
    document.getElementById("matrix-11").value,
  ].map(Number);

  if (keyInput.length !== 4) {
    alert("Key matrix must be a 2x2 matrix (4 values).");
    return null;
  }

  return [keyInput.slice(0, 2), keyInput.slice(2, 4)];
}

function matrixMultiply(matrix, vector) {
  return [
    (matrix[0][0] * vector[0] + matrix[0][1] * vector[1]) % 26,
    (matrix[1][0] * vector[0] + matrix[1][1] * vector[1]) % 26,
  ].map((num) => ((num % 26) + 26) % 26);
  console.log(matrix);
}

//menghitung matriks invers
function calculateInverseMatrix(matrix, invDet) {
  return [
    [(matrix[1][1] * invDet) % 26, (-matrix[0][1] * invDet) % 26],
    [(-matrix[1][0] * invDet) % 26, (matrix[0][0] * invDet) % 26],
  ].map((row) => row.map((num) => ((num % 26) + 26) % 26));
}

// event listener untuk button generate
document
  .getElementById("generate-button")
  .addEventListener("click", function (event) {
    event.preventDefault();
    if (isEncryptionMode) {
      encrypt();
    } else {
      decrypt();
    }
  });
