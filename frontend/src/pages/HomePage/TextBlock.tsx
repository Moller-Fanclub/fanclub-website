function TextBlock() {
    return (
      <section className="relative flex flex-col items-center pb-16 -mt-28">
        <div className="mx-auto w-full max-w-3xl px-6 text-center text-gray-900 md:text-left">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Kitzbühel World Cup 2026</h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-700">
            The year is 2026.
            <br />
            <br />
            Welcome to Kitzbühel, Austria – home of the legendary
            Hahnenkammrennen. Each January, the world’s best alpine skiers
            gather here to face the ultimate test of courage and skill: the
            infamous Streif downhill course.
            <br />
            <br />
            With its steep gradients, sharp turns, and breathtaking jumps, the
            race is regarded as the most spectacular and dangerous on the World
            Cup calendar. Tens of thousands of fans line the slopes and the town
            comes alive with excitement, tradition, and passion for ski racing.
            <br />
            <br />
            In 2026, a new chapter will be written. Will records be broken, or
            legends cemented forever? The countdown has already begun and the
            eyes of the alpine world are on Kitzbühel.
          </p>
        </div>
        <img
          className="mt-10 h-auto w-full max-w-3xl rounded-lg shadow-lg"
          src="/images/sunvalley_fanclub_img.JPG"
          alt="Sun Valley fanclub"
        />

      </section>
    );
}

export default TextBlock;
