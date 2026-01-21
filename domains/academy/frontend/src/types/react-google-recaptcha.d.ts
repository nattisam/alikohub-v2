declare module 'react-google-recaptcha' {
  import React from 'react';

  interface ReCAPTCHAProps {
    sitekey: string;
    onChange: (token: string | null) => void;
    onErrored?: () => void;
    onExpired?: () => void;
    onReady?: () => void;
    theme?: 'light' | 'dark';
    size?: 'compact' | 'normal' | 'invisible';
    tabIndex?: number;
    hl?: string;
    grecaptcha?: any;
    badge?: 'bottomright' | 'bottomleft' | 'inline';
  }

  export interface ReCAPTCHA extends React.Component<ReCAPTCHAProps> {
    reset(): void;
    execute(): void;
    executeAsync(): Promise<string>;
    getResponse(): string;
  }

  const ReCAPTCHA: React.FC<ReCAPTCHAProps>;

  export default ReCAPTCHA;
}