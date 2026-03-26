import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Target, GraduationCap, Calendar, ArrowRight, BookOpen, Clock, Layout } from 'lucide-react';
import ScrollReveal from '../../components/ui/ScrollReveal';

interface Tool {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  delay: number;
  comingSoon?: boolean;
}

interface ToolGroup {
  name: string;
  icon: React.ReactNode;
  tools: Tool[];
}

const toolGroups: ToolGroup[] = [
  {
    name: "Academic Performance",
    icon: <BookOpen className="w-5 h-5" />,
    tools: [
      {
        title: "Academic Hub",
        description: "Unified tracker for GWA, Latin Honors, and Scholarship eligibility with CSV import.",
        icon: <Calculator className="w-8 h-8 text-[var(--primary)]" />,
        path: "/tools/gwa",
        delay: 0
      },
      {
        title: "Target GWA Calculator",
        description: "Calculate what grades you need in remaining units to reach your goal GWA.",
        icon: <Target className="w-8 h-8 text-[var(--c-yellow-dim)]" />,
        path: "/tools/target",
        delay: 0.1
      },
      {
        title: "Grade Calculator",
        description: "Determine the required final exam score to pass or hit a target subject grade.",
        icon: <GraduationCap className="w-8 h-8 text-[var(--c-orange-fire)]" />,
        path: "/tools/final",
        delay: 0.2
      }
    ]
  },
  {
    name: "Productivity & Scheduling",
    icon: <Clock className="w-5 h-5" />,
    tools: [
      {
        title: "Productivity Hub",
        description: "Unified command center for Study Planning, Pomodoro Timer, and Assignment Tracking.",
        icon: <Layout className="w-8 h-8 text-[var(--primary)]" />,
        path: "/tools/productivity-hub",
        delay: 0.3,
        comingSoon: true
      },
      {
        title: "Class Scheduler",
        description: "Premium visual timeblocking for your weekly classes with easy URL sharing.",
        icon: <Calendar className="w-8 h-8 text-[var(--c-yellow)]" />,
        path: "/tools/schedule",
        delay: 0.4,
        comingSoon: true
      }
    ]
  }
];

const ToolsHome: React.FC = () => {
  return (
    <div className="space-y-16">
      {toolGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-8">
           <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
             <div className="p-2 bg-[var(--primary)] text-white">
               {group.icon}
             </div>
             <h2 className="text-lg text-[var(--foreground)]">{group.name}</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {group.tools.map((tool: Tool, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={tool.delay}>
                {tool.comingSoon ? (
                  <div 
                    className="group block p-8 bg-[var(--surface)] border border-[var(--border)] opacity-60 cursor-not-allowed relative overflow-hidden"
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-[var(--primary)] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-tighter">
                        Coming Soon
                      </span>
                    </div>

                    <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity">
                      {tool.icon}
                    </div>
                    
                    <div className="mb-6 bg-[var(--background)] w-16 h-16 flex items-center justify-center border border-[var(--border)] transition-colors">
                      {tool.icon}
                    </div>
                    
                    <h3 className="font-heading text-xl text-[var(--foreground)] mb-3 transition-colors">
                      {tool.title}
                    </h3>
                    
                    <p className="font-body text-[var(--foreground-muted)] text-sm mb-6 leading-relaxed">
                      {tool.description}
                    </p>
                    
                    <div className="flex items-center text-[var(--foreground-muted)] font-heading text-xs font-bold uppercase tracking-wider">
                      Unavailable <ArrowRight size={16} className="ml-2" />
                    </div>
                  </div>
                ) : (
                  <Link 
                    to={tool.path}
                    className="group block p-8 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] transition-all hover:-translate-y-2 hover:shadow-xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      {tool.icon}
                    </div>
                    
                    <div className="mb-6 bg-[var(--background)] w-16 h-16 flex items-center justify-center border border-[var(--border)] group-hover:border-[var(--primary)] transition-colors">
                      {tool.icon}
                    </div>
                    
                    <h3 className="font-heading text-xl text-[var(--foreground)] mb-3 group-hover:text-[var(--primary)] transition-colors">
                      {tool.title}
                    </h3>
                    
                    <p className="font-body text-[var(--foreground-muted)] text-sm mb-6 leading-relaxed">
                      {tool.description}
                    </p>
                    
                    <div className="flex items-center text-[var(--primary)] font-heading text-xs font-bold uppercase tracking-wider">
                      Open Tool <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                )}
              </ScrollReveal>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToolsHome;
