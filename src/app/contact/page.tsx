import Link from 'next/link';
import { Github, Linkedin, Mail, MapPin, Clock, MessageSquare, Briefcase, Zap } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-6 pb-24 pt-28">
      <header className="space-y-4 text-center md:text-left">
        <span className="text-xs uppercase tracking-[0.5em] text-foreground-muted">Contact</span>
        <h1 className="text-4xl text-foreground md:text-5xl">Let's connect</h1>
        <p className="text-base leading-relaxed text-foreground-soft md:text-lg">
          I'm always open to new AI and machine learning collaborations, product partnerships, or quick chats about an
          idea. Whether you're looking to collaborate on a project, discuss opportunities, or just want to connect, I'd
          love to hear from you.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Primary Contact Card */}
        <section className="frosted-card rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="rounded-full border border-soft p-3 text-primary">
              <Mail size={24} />
            </span>
            <h2 className="text-xl text-foreground">Get in touch</h2>
          </div>
          <div className="space-y-4 text-sm text-foreground-soft">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-primary flex-shrink-0" />
              <Link href="mailto:samar.k.khajuria@gmail.com" className="hover:text-primary transition">
                samar.k.khajuria@gmail.com
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-primary flex-shrink-0" />
              <span>Richmond, British Columbia, Canada</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-primary flex-shrink-0" />
              <span>Usually respond within 24-48 hours</span>
            </div>
          </div>
        </section>

        {/* Social Links Card */}
        <section className="frosted-card rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="rounded-full border border-soft p-3 text-primary">
              <MessageSquare size={24} />
            </span>
            <h2 className="text-xl text-foreground">Connect online</h2>
          </div>
          <div className="space-y-3">
            <Link
              href="https://www.linkedin.com/in/samar-khajuria-b70591264/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-soft bg-surface-soft p-4 transition hover:border-primary hover:text-primary"
            >
              <Linkedin size={20} className="text-primary" />
              <span className="text-sm font-medium">LinkedIn</span>
            </Link>
            <Link
              href="https://github.com/SUMMERxKx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-soft bg-surface-soft p-4 transition hover:border-primary hover:text-primary"
            >
              <Github size={20} className="text-primary" />
              <span className="text-sm font-medium">GitHub</span>
            </Link>
          </div>
        </section>
      </div>

      {/* What I'm Looking For Section */}
      <section className="frosted-card rounded-3xl p-8 md:p-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="rounded-full border border-soft p-3 text-primary">
            <Briefcase size={24} />
          </span>
          <h2 className="text-2xl text-foreground">What I'm looking for</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <div className="rounded-2xl border border-soft bg-surface-soft p-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={18} className="text-primary" />
              <h3 className="text-lg text-foreground">Collaborations</h3>
            </div>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Excited to work on AI/ML projects, full-stack applications, or innovative product ideas. I enjoy
              collaborating with teams that value clean code and thoughtful design.
            </p>
          </div>
          <div className="rounded-2xl border border-soft bg-surface-soft p-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={18} className="text-primary" />
              <h3 className="text-lg text-foreground">Opportunities</h3>
            </div>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Open to discussing co-op positions, internships, freelance projects, or full-time opportunities in
              software development, especially in AI-focused products.
            </p>
          </div>
        </div>
      </section>

      {/* Best Ways to Reach Me */}
      <section className="frosted-card rounded-3xl p-8">
        <h2 className="text-xl text-foreground mb-6">Best ways to reach me</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4 rounded-2xl border border-soft bg-surface-soft p-4">
            <Mail size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Email</h3>
              <p className="text-sm text-foreground-muted">
                Best for formal inquiries, project proposals, or detailed discussions. I check my email regularly and
                typically respond within 24-48 hours.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl border border-soft bg-surface-soft p-4">
            <Linkedin size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">LinkedIn</h3>
              <p className="text-sm text-foreground-muted">
                Great for professional networking, career opportunities, or connecting with fellow developers and
                industry professionals.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl border border-soft bg-surface-soft p-4">
            <Github size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">GitHub</h3>
              <p className="text-sm text-foreground-muted">
                Perfect for technical discussions, code reviews, open-source collaborations, or checking out my latest
                projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Note */}
      <div className="rounded-2xl border border-primary/30 bg-primary-soft p-6 text-center">
        <p className="text-sm text-foreground-soft leading-relaxed">
          Don't hesitate to reach out—I'm always interested in hearing about new projects, ideas, or opportunities.
          Looking forward to connecting!
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
