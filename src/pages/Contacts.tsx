import React from 'react';
import { Mail, MapPin } from 'lucide-react';
import ScrollReveal from '../components/ui/ScrollReveal';
import HeroSection from '../components/HeroSection';
import GradientSection from '../components/GradientSection';
import FacebookFeed from '../components/social/FacebookFeed';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const socials = [
  {
    name: 'Facebook',
    icon: FaFacebook,
    handle: '@jpcs.uemanila',
    url: 'https://facebook.com/jpcs.uemanila',
    color: '#1877F2',
  },
  {
    name: 'Instagram',
    icon: FaInstagram,
    handle: '@jpcs.uemanila',
    url: 'https://instagram.com/jpcs.uemanila',
    color: '#E4405F',
  },
  {
    name: 'LinkedIn',
    icon: FaLinkedin,
    handle: '@jpcs-uemanila',
    url: 'https://linkedin.com/company/jpcs-uemanila',
    color: '#0A66C2',
  },
];

const Contacts: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO HEADER */}
      <HeroSection className="min-h-[50vh] py-32 flex items-center justify-center">
        <div className="text-center max-w-4xl px-4 mx-auto">
            <ScrollReveal animation="fade-up">
                <h1 className="text-white mb-6 text-shadow-glow">
                  CONTACT US
                </h1>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={0.2}>
                <p className="font-body text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                  Connect with the Junior Philippine Computer Society UE Manila Chapter.
                </p>
            </ScrollReveal>
        </div>
      </HeroSection>

      {/* 2. CONTACT INFO SECTION */}
      <GradientSection>
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                <ScrollReveal animation="slide-left">
                  <div className="space-y-8">
                    <h2 className="text-[var(--foreground)] mb-8">
                      GET IN TOUCH
                    </h2>

                    <div className="flex flex-col gap-8">
                      {/* Address */}
                      <div className="flex gap-5">
                        <div className="w-12 h-12 bg-gradient-to-br from-[var(--c-red-dark)] to-[var(--c-orange)] flex items-center justify-center flex-shrink-0 shadow-lg text-white">
                          <MapPin size={24} />
                        </div>
                        <div>
                          <h3 className="text-[var(--foreground)] mb-1 text-sm font-bold">ADDRESS</h3>
                          <p className="font-body text-[var(--foreground-muted)] leading-relaxed">
                            University of the East<br />
                            2219 C.M. Recto Ave<br />
                            Sampaloc, Manila
                          </p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex gap-5">
                        <div className="w-12 h-12 bg-gradient-to-br from-[var(--c-red-dark)] to-[var(--c-orange)] flex items-center justify-center flex-shrink-0 shadow-lg text-white">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="text-[var(--foreground)] mb-1 text-sm font-bold">EMAIL</h3>
                            <p className="font-body text-[var(--foreground-muted)]">
                                jpcs.uemanila@ue.edu.ph
                            </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Social Links Grid */}
                <ScrollReveal animation="slide-right">
                  <div className="space-y-8">
                    <h2 className="text-[var(--foreground)] mb-8">
                      SOCIAL CHANNELS
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {socials.map((social, idx) => (
                        <a
                          key={idx}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center p-6 bg-[var(--surface)] border border-[var(--border)] transition-all hover:-translate-y-1 hover:border-[var(--primary)] group"
                        >
                          <div 
                              className="w-12 h-12 flex items-center justify-center mb-3 text-white rounded-lg"
                              style={{ background: social.color }}
                          >
                            <social.icon size={24} />
                          </div>
                          <span className="font-heading text-[10px] text-[var(--foreground)] uppercase tracking-widest">{social.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
            </div>

            {/* Facebook Feed Section */}
            <div className="pt-20 border-t border-[var(--border)]">
               <ScrollReveal animation="fade-up">
                  <div className="text-center mb-12">
                     <h2 className="text-[var(--foreground)] mb-4">LATEST UPDATES</h2>
                     <p className="font-body text-[var(--foreground-muted)]">Stay in the loop with our activities on Facebook.</p>
                  </div>
               </ScrollReveal>

               <div className="max-w-3xl mx-auto">
                  <ScrollReveal animation="fade-up" delay={0.2}>
                     <FacebookFeed pageUrl="https://www.facebook.com/jpcs.uemanila" />
                  </ScrollReveal>
               </div>
            </div>
        </div>
      </GradientSection>
    </div>
  );
};

export default Contacts;
