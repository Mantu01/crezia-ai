import { Sparkles, Palette, Zap, Download } from 'lucide-react';

export default function Features() {
  const features = [
    { icon: Sparkles, title: "AI-Powered Generation", desc: "Create stunning thumbnails in seconds with advanced AI algorithms" },
    { icon: Palette, title: "Custom Branding", desc: "Maintain brand consistency with customizable templates and styles" },
    { icon: Zap, title: "Lightning Fast", desc: "Generate professional thumbnails 10x faster than traditional methods" },
    { icon: Download, title: "Multiple Formats", desc: "Export in various formats and resolutions for all platforms" }
  ];

  return (
    <section id="features" className="relative z-10 px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features for
            <br />
            <span className="text-gray-400">Creative Professionals</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to create engaging thumbnails that stand out in crowded feeds
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="group p-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:bg-gray-900/80">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}