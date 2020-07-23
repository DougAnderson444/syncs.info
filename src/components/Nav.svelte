<script>
  export let segment
  import CreateSubdomain from '../components/CreateSubdomain'
  import SaveBar from '../components/SaveBar.svelte'
</script>

<style>
  nav {
    border-bottom: 1px solid rgba(84, 84, 0, 0.1);
    font-weight: 300;
    padding: 0 1em;

    display: -moz-box;
    -moz-box-orient: horizontal;
    -moz-box-pack: center;
    -moz-box-align: center;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-pack: center;
    -webkit-box-align: center;
    width: auto;
  }

  ul {
    margin: 0;
    padding: 0;
    display: inline-block;
  }

  /* clearfix */
  ul::after {
    content: '';
    display: block;
    clear: both;
  }

  li {
    display: block;
    float: left;
  }

  [aria-current] {
    position: relative;
    display: inline-block;
  }

  [aria-current]::after {
    position: absolute;
    content: '';
    width: calc(100% - 1em);
    height: 2px;
    background-color: rgb(84, 84, 0);
    display: block;
    bottom: -1px;
  }

  a {
    text-decoration: none;
    padding: 1em 0.5em;
    display: block;
  }

  .box2 {
    -moz-box-flex: 1;
    -webkit-box-flex: 1;
  }
</style>

<nav>
  <div class="box box1">
    <ul>
      <li>
        <a aria-current={segment === undefined ? 'page' : undefined} href=".">
          home
        </a>
      </li>
      <li>
        <a aria-current={segment === 'about' ? 'page' : undefined} href="about">
          about
        </a>
      </li>

      <!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen -->
      <li>
        <a
          rel="prefetch"
          aria-current={segment === 'blog' ? 'page' : undefined}
          href="blog">
          blog
        </a>
      </li>
    </ul>
  </div>
  <div class="box box2" />
  <div class="box box3">
    <ul>
      <li>
        <CreateSubdomain />
      </li>
    </ul>
  </div>
</nav>
<!-- Put a banner here: Temporary page! Wanna go steady? Secure this page  -->
<SaveBar />