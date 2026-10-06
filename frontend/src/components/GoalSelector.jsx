import React from 'react';
import { ArrowRight, Sparkles, Compass, Hammer } from 'lucide-react';

export default function GoalSelector({ onSelectGoal, selectedGoal }) {
  const choices = [
    {
      id: 'improve',
      icon: Sparkles,
      title: 'Improve it',
      description: 'Make the idea clearer and stronger',
      badge: 'Sharpen wedge',
    },
    {
      id: 'research',
      icon: Compass,
      title: 'Research it',
      description: 'Check the problem, users and existing solutions',
      badge: 'Validate need',
    },
    {
      id: 'build',
      icon: Hammer,
      title: 'Plan the build',
      description: 'Turn it into a realistic MVP',
      badge: 'Technical plan',
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-3.5 text-left">
        <h3 className="text-base font-semibold text-charcoal font-serif">
          What do you want to figure out?
        </h3>
        <p className="text-xs text-charcoal-muted">
          Select a focus to guide the next decision.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {choices.map((choice) => {
          const Icon = choice.icon;
          const isSelected = selectedGoal === choice.id;

          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => onSelectGoal(choice.id)}
              className={`group text-left p-5 rounded-lg border transition-all duration-150 flex flex-col justify-between h-full bg-warm-canvas ${
                isSelected
                  ? 'border-charcoal ring-1 ring-charcoal'
                  : 'border-warm-border hover:border-charcoal/60 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded border ${
                    isSelected
                      ? 'bg-charcoal text-white border-charcoal'
                      : 'bg-warm-panel text-charcoal border-warm-border group-hover:border-charcoal/40'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-soft">
                    {choice.badge}
                  </span>
                </div>

                <h4 className="text-base font-semibold text-charcoal mb-1">
                  {choice.title}
                </h4>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  {choice.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-warm-border/60 flex items-center justify-between text-xs font-medium text-charcoal">
                <span>Select</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
