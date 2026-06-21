import { useState, useEffect } from 'react';
import { tokenStore } from '../services/token_store';

export interface AuthImageState {
  blobUrl:    string | null;
  loadingImg: boolean;
  failed:     boolean;
  errorCode:  string | null;
}

/**
 * Fetches an image URL with Bearer auth and returns a blob URL for <img src>.
 *
 * In DEV: strips the origin so the Vite proxy routes /storage/... → backend (avoids CORS).
 * In PROD: uses the full URL directly (images must be publicly accessible or backend must
 *          return Access-Control-Allow-Origin for fetch with auth headers).
 */
export function useAuthImage(url?: string): AuthImageState {
  const [blobUrl,    setBlobUrl]    = useState<string | null>(null);
  const [loadingImg, setLoadingImg] = useState(!!url);
  const [failed,     setFailed]     = useState(false);
  const [errorCode,  setErrorCode]  = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setBlobUrl(null);
      setLoadingImg(false);
      setFailed(false);
      setErrorCode(null);
      return;
    }

    let cancelled = false;
    let objUrl    = '';
    const controller = new AbortController();

    setBlobUrl(null);
    setLoadingImg(true);
    setFailed(false);
    setErrorCode(null);

    const fetchUrl = import.meta.env.DEV
      ? url.replace(/^https?:\/\/[^/]+/, '')
      : url;
    const token = tokenStore.get();

    fetch(fetchUrl, {
      signal:  controller.signal,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => {
        if (!r.ok) throw Object.assign(new Error(String(r.status)), { status: r.status });
        return r.blob();
      })
      .then(blob => {
        if (cancelled) return;
        objUrl = URL.createObjectURL(blob);
        setBlobUrl(objUrl);
        setLoadingImg(false);
      })
      .catch((err: unknown) => {
        if (cancelled || (err as { name?: string }).name === 'AbortError') return;
        const code  = (err as { status?: number })?.status;
        const label = code ? `HTTP ${code}` : 'réseau';
        setErrorCode(label);
        setFailed(true);
        setLoadingImg(false);
        console.warn(`[useAuthImage] ${label} →`, fetchUrl);
      });

    return () => {
      cancelled = true;
      controller.abort();
      if (objUrl) URL.revokeObjectURL(objUrl);
    };
  }, [url]);

  return { blobUrl, loadingImg, failed, errorCode };
}
