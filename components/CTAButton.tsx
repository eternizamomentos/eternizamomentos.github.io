type Props = {
  href: string;
  children: React.ReactNode;
};

export default function CTAButton({ href, children }: Props) {
  return (
    <a
      href="https://docs.google.com/forms/d/e/1FAIpQLSeAD0LAytFFMwwMwj1WbKgutcJGoWKtNfr4j-z08vGT3TtX3w/viewform"

      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-accent-gold text-white font-medium px-6 py-3 rounded-lg hover:bg-accent-rose transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-gold"
    >
      {children}
    </a>
  );
}
