// Ordinarily, you'd generate this data from markdown files in your
// repo, or fetch them from a database of some kind. But in order to
// avoid unnecessary dependencies in the starter template, and in the
// service of obviousness, we're just going to leave it here.

// This file is called `_posts.js` rather than `posts.js`, because
// we don't want to create an `/blog/posts` route — the leading
// underscore tells Sapper not to do that.

/*
,

	{
		title: 'How to use Syncs Info',
		slug: 'how-to-use-syncs',
		html: `
			<h2>Step one</h2>
			<p>Create a new digital identity, yourNickName.syncs.info</p>

			<h2>Save some info </h2>
			<p>Maybe your favorite color?</p>

			<h2>Step three</h2>
			<p>Exchange syncs with friends.</p>

			<h2>Step four</h2>
			<p>When their info changes, you'll get updates!</p>
		`
	},

	{
		title: 'Why the name?',
		slug: 'why-the-name',
		html: `
			<p>Syncs.info is all about your data, your way.</p>

			<p>On the web, we don't really have a digital identity these days. Syncs.info was chosen because when 
			you put your name in front, it allows https://you.who.syncs.info</p>
		`
	},

	{
		title: 'How is Sapper different from Sign-In with Google?',
		slug: 'how-is-sapper-different-from-signin',
		html: `
			<p>Syncs.info is semi-self-soverign. This means you control your own secrets, not us.</p>
		`
	},

	{
		title: 'How can I get involved?',
		slug: 'how-can-i-get-involved',
		html: `
			<p>We're so glad you asked! Come on over to the <a href='https://github.com/DougAnderson444/syncs.info'>Github Syncs.Info</a> repo. Everyone is welcome, especially you!</p>
		`
	}
*/ 

const posts = [
  {
    title: "What is Syncs.info?",
    slug: "what-is-syncs-info",
    html: `
			<p>Syncs info is a plce to put your data and sync it with others.</p>
		`
  }
];

posts.forEach((post) => {
  post.html = post.html.replace(/^\t{3}/gm, "");
});

export default posts;
