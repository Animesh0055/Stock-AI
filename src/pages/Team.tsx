import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useInView } from 'framer-motion';
import { TeamMember } from '../types';
import { generateMockTeam } from '../utils/mockData';
import Card from '../components/UI/Card';

const team: TeamMember[] = generateMockTeam();

const TeamMemberCard: React.FC<{ member: TeamMember; index: number }> = ({ member, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Smoother 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const entryDirection = index % 2 === 0 ? -100 : 100;
  const entryRotation = index % 2 === 0 ? -15 : 15;

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-full"
      initial={{ opacity: 0, x: entryDirection, rotate: entryRotation }}
      animate={isInView ? {
        opacity: 1,
        x: 0,
        rotate: 0,
        // Continuous "hanging" or "floating" animation
        y: [0, -12, 0],
      } : {}}
      transition={{
        // Transitions for the "airplane" entry
        opacity: { duration: 0.6, delay: index * 0.15 },
        x: { type: 'spring', stiffness: 80, damping: 20, delay: index * 0.15 },
        rotate: { type: 'spring', stiffness: 80, damping: 20, delay: index * 0.15 },
        // Transition for the continuous floating
        y: {
          duration: 7 + index * 0.5, // Each card floats at a different speed
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
          delay: 1 + index * 0.2, // Delay start of floating until after entry
        }
      }}
    >
      <Card className="h-full !p-0 overflow-hidden relative" hover={false}>
        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 z-10"
          style={{
            background: useTransform(
              [mouseXSpring, mouseYSpring],
              ([newX, newY]) =>
                `radial-gradient(circle at ${ (newX + 0.5) * 100 }% ${ (newY + 0.5) * 100 }%, rgba(255, 255, 255, 0.2), transparent 40%)`
            ),
            opacity: useTransform([mouseXSpring, mouseYSpring], ([newX, newY]) => Math.sqrt(newX**2 + newY**2) * 0.5),
          }}
        />
        
        <div style={{ transform: 'translateZ(75px)', transformStyle: 'preserve-3d' }} className="p-6 flex flex-col h-full">
          <div className="flex items-center space-x-4 mb-4" style={{ transform: 'translateZ(40px)' }}>
            <motion.img
              src={member.avatar}
              alt={member.name}
              className="w-20 h-20 rounded-full border-2 border-accent"
              style={{ transform: 'translateZ(20px)' }}
              whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(138, 120, 243, 0.7)' }}
            />
            <div>
              <h3 className="text-xl font-bold text-text-primary">{member.name}</h3>
              <p className="text-accent font-medium">{member.role}</p>
            </div>
          </div>
          <p className="text-text-secondary text-sm mb-6 flex-grow" style={{ transform: 'translateZ(30px)' }}>{member.bio}</p>
          
          <div style={{ transform: 'translateZ(20px)' }}>
            <h4 className="text-text-primary font-semibold mb-3">Core Skills</h4>
            <div className="space-y-3">
              {member.skills.map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="w-full bg-surface-light rounded-full h-1.5">
                    <motion.div
                      className="bg-gradient-accent h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const Team: React.FC = () => {
  // For the background glow effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handlePageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };
  
  const backgroundX = useSpring(mouseX, { stiffness: 50, damping: 100 });
  const backgroundY = useSpring(mouseY, { stiffness: 50, damping: 100 });

  return (
    <div className="min-h-screen py-12 relative isolate overflow-hidden" onMouseMove={handlePageMouseMove}>
      {/* Interactive Background Glow */}
      <motion.div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: useTransform(
            [backgroundX, backgroundY],
            ([x, y]) => `radial-gradient(circle at ${x}px ${y}px, rgba(138, 120, 243, 0.15), transparent 40%)`
          ),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-4">
            Meet the{' '}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Architects
            </span>
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            The elite AI and human intelligence behind BlackBull's predictive power. Each member brings a unique expertise to navigate the financial cosmos.
          </p>
        </motion.div>

        <div
          className="grid grid-cols-1 md:grid-cols-6 gap-8"
          style={{ perspective: '1200px' }}
        >
          {team.map((member, index) => {
            let gridClass = '';
            if (index === 0 || index === 1) gridClass = 'md:col-span-3';
            else gridClass = 'md:col-span-2';
            
            return (
              <div key={member.id} className={gridClass}>
                <TeamMemberCard member={member} index={index} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Team;
