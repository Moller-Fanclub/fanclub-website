import './HomePage.css';

function TextBlock() {
    return (
      <div id="textblock">
        <div id="textblock-container">
          <h1 id="textblock-title">Kitzbühel World Cup 2026</h1>
          <p id="textblock-content">
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
          id="textblock-image"
          src="/images/sunvalley_fanclub_img.JPG"
          alt="Sun Valley fanclub"
        />
        <footer id="textblock-footer">
          Made with 🏔️ by&nbsp;
          <a
            id="textblock-devsense"
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          >
            Rory, Ivar, Oskar, Daniel og Bjørge Technologies
          </a>
        </footer>
      </div>
    );
}

export default TextBlock;
