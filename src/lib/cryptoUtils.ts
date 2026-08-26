// src/lib/cryptoUtils.ts
// E2EE Web Crypto API Implementation

/**
 * Gera um par de chaves RSA-OAEP para uso em E2EE
 */
export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
}

/**
 * Exporta uma chave pública CryptoKey para uma string JWK
 */
export async function exportPublicKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey("jwk", key);
  return JSON.stringify(exported);
}

/**
 * Exporta uma chave privada CryptoKey para uma string JWK
 */
export async function exportPrivateKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey("jwk", key);
  return JSON.stringify(exported);
}

/**
 * Importa uma string JWK pública para um objeto CryptoKey
 */
export async function importPublicKey(jwkString: string): Promise<CryptoKey> {
  const jwk = JSON.parse(jwkString);
  return await window.crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );
}

/**
 * Importa uma string JWK privada para um objeto CryptoKey
 */
export async function importPrivateKey(jwkString: string): Promise<CryptoKey> {
  const jwk = JSON.parse(jwkString);
  return await window.crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"]
  );
}

/**
 * Criptografa uma mensagem em texto plano usando a chave pública do destinatário
 */
export async function encryptMessage(text: string, publicKey: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP"
    },
    publicKey,
    data
  );
  // Converte ArrayBuffer para Base64
  return arrayBufferToBase64(encrypted);
}

/**
 * Descriptografa uma mensagem em Base64 usando a chave privada local do usuário
 */
export async function decryptMessage(encryptedBase64: string, privateKey: CryptoKey): Promise<string> {
  try {
    const encryptedData = base64ToArrayBuffer(encryptedBase64);
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP"
      },
      privateKey,
      encryptedData
    );
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error("Falha ao descriptografar mensagem", error);
    return "[Mensagem Ilegível - Erro de Chave]";
  }
}

// Helpers para Base64 <-> ArrayBuffer
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

import { supabase } from '@/integrations/supabase/client';

/**
 * Verifica se o usuário já tem chaves geradas neste dispositivo.
 * Se não, gera um novo par, salva a privada localmente e envia a pública pro banco.
 */
export async function initializeUserKeys(userId: string): Promise<void> {
  try {
    const localKey = localStorage.getItem(`private_key_${userId}`);
    if (localKey) return; // Chave já existe neste dispositivo

    console.log("Gerando novas chaves E2EE para o usuário...");
    const keyPair = await generateKeyPair();
    
    const publicKeyJwk = await exportPublicKey(keyPair.publicKey);
    const privateKeyJwk = await exportPrivateKey(keyPair.privateKey);

    // Salva a chave privada localmente no navegador (Nunca vai pro servidor)
    localStorage.setItem(`private_key_${userId}`, privateKeyJwk);

    // Salva a chave pública no perfil do usuário no Supabase
    const { error } = await supabase
      .from('profiles')
      .update({ public_key: publicKeyJwk })
      .eq('id', userId);

    if (error) {
      console.error("Erro ao salvar chave pública:", error);
    } else {
      console.log("Chaves geradas e sincronizadas com sucesso!");
    }
  } catch (error) {
    console.error("Erro no processo de chaves E2EE:", error);
  }
}
