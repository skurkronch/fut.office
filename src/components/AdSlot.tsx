'use client';

interface Props {
  label?: string;
  className?: string;
}

export default function AdSlot({ label, className = '' }: Props) {
  return (
    <div
      className={`w-full min-h-[90px] bg-chalk/60 border border-dashed border-ink/20 rounded-xl flex items-center justify-center ${className}`}
    >
      <span className="font-mono text-xs text-ink/20 uppercase tracking-widest">
        {label ?? 'Publicidad'}
      </span>
      {/*
        Google AdSense slot — replace with your actual ad code:
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      */}
    </div>
  );
}
