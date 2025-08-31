export default function Process() {
  return (
    <section className="relative z-10 px-6 py-20 bg-gray-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple 3-Step Process
          </h2>
          <p className="text-xl text-gray-400">
            From idea to thumbnail in under 60 seconds
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Input Your Content", desc: "Upload your video or describe your content theme" },
            { step: "2", title: "AI Magic Happens", desc: "Our AI analyzes and generates multiple thumbnail options" },
            { step: "3", title: "Download & Use", desc: "Choose your favorite and download in any format" }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto">
                {item.step}
              </div>
              <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}