const CoopFinalProjectPage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-12 px-6 pb-24 pt-28">
      {/* Title Page Section */}
      <header className="text-center space-y-8 py-12">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.5em] text-foreground-muted">
            Co-operative Education Program
          </p>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Co-op Work Term 3
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            Final Reflection Report
          </h2>
        </div>

        <p className="text-lg text-foreground-soft">
          Reflecting on My Co-op Journey
        </p>

        <div className="space-y-2 pt-8">
          <p className="text-xl font-bold text-foreground">Samar Khajuria</p>
          <p className="text-base text-foreground-muted">Student Number: T00714740</p>
        </div>

        <div className="pt-12 space-y-2 text-foreground-soft">
          <p className="text-base">Bachelor of Computing Science</p>
          <p className="text-base">Thompson Rivers University</p>
          <p className="text-base pt-2">Co-op Work Term 3</p>
          <p className="text-sm pt-4 text-foreground-muted">
            {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <article className="space-y-8 text-foreground-soft leading-relaxed">
        <p className="text-base md:text-lg">
          I enrolled in the Co-op program in 2024 because I wanted to gain real, hands-on experience before graduating. While my Computing Science courses provided a strong technical foundation, I knew that learning only in a classroom setting would limit my growth. I wanted to understand how technology is used in real organizations, how teams collaborate, and what professional expectations actually look like day to day. Co-op gave me the opportunity to step into that environment and learn through experience.
        </p>

        <section className="frosted-card rounded-3xl p-8 space-y-4">
          <h2 className="text-2xl font-bold text-primary mb-4">Why I Joined the Co-op Program</h2>
          <p className="text-base md:text-lg">
            My main motivation for joining the Co-op program was to develop confidence in a professional setting. I wanted to graduate with practical experience, not just academic knowledge. I was interested in learning how technical work connects to business needs, how teams communicate, and how projects move from idea to execution. Over time, I realized that Co-op is also about learning what kind of work environment fits you best and what you value in a long-term career.
          </p>
        </section>

        <section className="frosted-card rounded-3xl p-8 space-y-4">
          <h2 className="text-2xl font-bold text-primary mb-4">How I Secured My Work Term</h2>
          <p className="text-base md:text-lg">
            Finding a work term was a challenging process. I experienced multiple rejections, which at times felt discouraging. However, each application helped me improve. I refined my resume, strengthened how I explained my skills, and learned how to clearly communicate my past experience from roles at Thompson Rivers University.
          </p>
          <p className="text-base md:text-lg">
            Having previous Co-op and technical support experience helped me stay persistent and approach the process strategically. When I finally received an offer, I felt both relieved and excited. Working outside of Kamloops felt like a meaningful step forward, offering both professional growth and a new personal experience.
          </p>
        </section>

        <section className="frosted-card rounded-3xl p-8 space-y-4">
          <h2 className="text-2xl font-bold text-primary mb-4">Adjusting to the Workplace</h2>
          <p className="text-base md:text-lg">
            Transitioning into the workplace required adjusting to a larger and more structured organization than I was used to. The environment involved defined processes, formal workflows, and clear expectations. At first, this felt overwhelming, but the onboarding support and guidance from my team made the transition smoother.
          </p>
          <p className="text-base md:text-lg">
            Because of my prior Co-op and technical support experience, I adapted quickly. I was comfortable asking questions, seeking feedback, and learning new systems. One of the highlights of the work term was participating in drop-in sports after work. These informal interactions helped me connect with colleagues across departments and made building professional relationships feel natural.
          </p>
        </section>

        <section className="frosted-card rounded-3xl p-8 space-y-4">
          <h2 className="text-2xl font-bold text-primary mb-4">Skills and Professional Growth</h2>
          <p className="text-base md:text-lg">
            This work term helped me grow both technically and professionally. I gained hands-on experience with tools such as Power Automate, Power Apps, Power BI, SharePoint administration, and Azure. Beyond learning specific tools, I developed a better understanding of how technology supports organizational workflows and service delivery.
          </p>
          <p className="text-base md:text-lg">
            I also gained exposure to Agile development practices and the software development lifecycle. Participating in scrum meetings, working through iterative tasks, and collaborating with stakeholders improved my communication skills, time management, and ability to contribute effectively within a team.
          </p>
        </section>

        <section className="frosted-card rounded-3xl p-8 space-y-4">
          <h2 className="text-2xl font-bold text-primary mb-4">How Co-op Shaped My Career Goals</h2>
          <p className="text-base md:text-lg">
            This Co-op experience reshaped how I think about my future career. Previously, my focus was primarily on securing a job after graduation. Now, I place greater value on finding a workplace where I feel supported, included, and able to grow. I realized that I thrive in larger organizations that offer structure, collaboration, and clear direction.
          </p>
          <p className="text-base md:text-lg">
            Co-op taught me that career satisfaction is not only about job titles or technical skills, but also about finding an environment that aligns with your values and supports long-term development.
          </p>
        </section>

        <section className="frosted-card rounded-3xl p-8 space-y-4">
          <h2 className="text-2xl font-bold text-primary mb-4">Final Reflection</h2>
          <p className="text-base md:text-lg">
            Looking back, this Co-op experience helped me grow in ways I did not fully expect. The job search process strengthened my persistence and resilience. The workplace environment improved my adaptability and communication skills. The projects allowed me to apply my technical knowledge while understanding real organizational needs.
          </p>
          <p className="text-base md:text-lg">
            Through reflection, I can clearly see how this experience shaped my professional development. I feel more confident, more focused, and better prepared for the next stage of my career.
          </p>
        </section>
      </article>
    </div>
  );
};

export default CoopFinalProjectPage;

