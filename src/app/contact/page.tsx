import Link from 'next/link';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-12 px-6 pb-24 pt-28">
      <header className="space-y-4 text-center md:text-left">
        <span className="text-xs uppercase tracking-[0.5em] text-secondary-soft">Contact</span>
        <h1 className="text-4xl text-foreground md:text-5xl">Let’s connect</h1>
        <p className="text-base leading-relaxed text-foreground-soft md:text-lg">
          I’m always open to new AI and machine learning collaborations, product partnerships, or quick chats about an
          idea. Email is the quickest way to reach me.
        </p>
      </header>

      <section className="frosted-card rounded-3xl p-8">
        <h2 className="text-lg text-foreground">Primary contact</h2>
        <div className="mt-6 space-y-4 text-sm text-foreground-soft">
          <p className="flex items-center gap-3">
            <Mail size={18} className="text-primary" />
            <Link href="mailto:samar.k.khajuria@gmail.com" className="hover:text-primary">
              samar.k.khajuria@gmail.com
            </Link>
          </p>
          <p className="flex items-center gap-3">
            <MapPin size={20} className="text-primary" />
            <span>Kamloops, British Columbia, Canada</span>
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em] text-secondary-soft">
          <Link
            href="https://www.linkedin.com/in/samar-khajuria-b70591264/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-soft px-4 py-2 transition hover:border-primary hover:text-primary"
          >
            <Linkedin size={16} /> LinkedIn
          </Link>
          <Link
            href="https://github.com/SUMMERxKx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-soft px-4 py-2 transition hover:border-primary hover:text-primary"
          >
            <Github size={16} /> GitHub
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;


