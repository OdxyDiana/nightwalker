<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="{S_CONTENT_DIRECTION}" id="min-width" lang="{L_LANG_HTML}" xml:lang="{L_LANG_HTML}" {NAMESPACE_FB_LIKE} {NAMESPACE_FB} {NAMESPACE_BBCODE}>
<head>
	<title>{SITENAME_TITLE}{PAGE_TITLE}</title>
	<meta http-equiv="content-type" content="text/html; charset={S_CONTENT_ENCODING}" />
	<meta http-equiv="content-script-type" content="text/javascript" />
	<meta http-equiv="content-style-type" content="text/css" />
	<!-- BEGIN switch_compat_meta -->
	<meta http-equiv="X-UA-Compatible" content="IE={switch_compat_meta.VERSION}" />
	<!-- END switch_compat_meta -->
	<!-- BEGIN switch_canonical_url -->
	<link rel="canonical" href="{switch_canonical_url.CANONICAL_URL}" />
	<!-- END switch_canonical_url -->
	{META_FAVICO}
	{META}
	{META_FB_LIKE}
	<meta name="title" content="{SITENAME_TITLE}{PAGE_TITLE}" />
	{T_HEAD_STYLESHEET}
	{CSS}
	<link rel="search" type="application/opensearchdescription+xml" href="/improvedsearch.xml" title="{SITENAME}" />
	<link rel="search" type="application/opensearchdescription+xml" href="{URL_BOARD_DIRECTORY}/search/improvedsearch.xml" title="{SEARCH_FORUMS}" />
	<script src="{JQUERY_PATH}" type="text/javascript"></script>
  <link href="//dl.dropbox.com/s/coqbt4aagxe10yw/F3insta.css" rel="stylesheet">
    <link href="//solrainha.github.io/saturnicons/saturnicons.css" rel="stylesheet">
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css"/>
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
  <script>$(function() {
    $(document).tooltip({    
        position: { my: "center bottom+75", at: "center bottom-20" }}
    );
    } );
  $(document).ready(function() {
  });
  </script>
  <!-- BEGIN switch_user_logged_in -->
  <script>
$(document).ready(function() {
    var uid="/u"+_userdata.user_id; 
    $("span#navidnick").html("<a href="+uid+">"+_userdata.username+"</a>");
    $.get(uid, function(data) {var urlmini=$(data).find('.perdlabel:contains("Personaje")').parent().find('.field_uneditable img').attr("src"); $("#navright img").attr("src",urlmini);}); 
    
    if ($(".navbar span").hasClass("new-message")) {
    $("span.nomp").addClass("simp"); 
    $("span.simp").removeClass("nomp");    
    var mpn=$(".navbar span.new-message").text().split(" ");
    $("a.yesnew #contador").text(mpn[1])};
   var notexi=setInterval( function () {
    	if ($("a.notis #contador:empty").length==1) {
    		var nnotif=$("#notif_unread").text().split("(");
    		var nnotiff=nnotif[1]?.split(")");
    $("a.notis #contador").text(nnotiff && nnotiff.length > 0 ? nnotiff[0] : "");
    $("#notif").append($("#notif_list"));
    	} else {
    		clearInterval(notexi);
    $("ul#notif_list").after($("ul#notif_list li.see_all"));
   	}
    }, 1000);
    $('a.navbot.notis').click(function () {$('#notif').fadeToggle(100);});
    var logout1=$('.navbar a#logout').attr('href');
    $('#navbar a.navbot.lout').attr('href',logout1);
    
    });
  </script>
  <!-- END switch_user_logged_in -->
    <!-- BEGIN switch_recent_jquery -->
    <script src="{JS_DIR}jquery1.9/jquery-migrate-1.4.1.js" type="text/javascript"></script>
    <script src="{JQUERY_DIR}browser/v1.0/jquery.browser.min.js" type="text/javascript"></script>
    <script src="{JQUERY_DIR}support/jquery.support.js" type="text/javascript"></script>

    <!-- END switch_recent_jquery -->
	<script src="{JS_DIR}{L_LANG}.js" type="text/javascript"></script>
    {RICH_SNIPPET_GOOGLE}

	<!-- BEGIN switch_fb_login -->
	<script src="https://connect.facebook.net/{switch_fb_login.FB_LOCAL}/all.js" type="text/javascript"></script>
	<script src="{switch_fb_login.JS_FB_LOGIN}" type="text/javascript"></script>
	<!-- END switch_fb_login -->

	<!-- BEGIN switch_ticker -->
	<link type="text/css" rel="stylesheet" href="{JQUERY_DIR}ticker/ticker.css" />
	<script src="{JQUERY_DIR}ticker/ticker.js" type="text/javascript"></script>
	<!-- END switch_ticker -->

	<!-- BEGIN switch_ticker_new -->
	<script src="{JQUERY_DIR}jcarousel/jquery.jcarousel.js" type="text/javascript"></script>
	<script type="text/javascript">//<![CDATA[
		/* Definir le sens de direction en fonction du panneau admin */
		var tickerDirParam = "{switch_ticker.DIRECTION}";
		var slid_vert = false;
		var auto_dir = 'next';
		var h_perso = parseInt({switch_ticker.HEIGHT});

		switch( tickerDirParam )
		{
			case 'top' :
				slid_vert = true;
				break;

			case 'left':
				break;

			case 'bottom':
				slid_vert = true;
				auto_dir = 'prev';
				break;

			case 'right':
				auto_dir = 'prev';
				break;

			default:
				slid_vert = true;
		}

		$(document).ready(function() {

			$('#fa_ticker_content').css('display','block');

			var width_max = $('ul#fa_ticker_content').width();
			var width_item = Math.floor(width_max / {switch_ticker.SIZE});

			if (width_max > 0)
			{
				$('ul#fa_ticker_content li').css('float','left').css('list-style','none').width(width_item).find('img').each(function () {
					if ($(this).width() > width_item)
					{
					var ratio		= $(this).width() / width_item;
					var new_height = Math.round($(this).height() / ratio);
					$(this).height(new_height).width(width_item);
					}
				});

				if (slid_vert)
				{
					var height_max = h_perso;

					$('ul#fa_ticker_content li').each( function () {
						if ($(this).height() > height_max)
						{
							height_max = $(this).height();
						}
					} );

					$('ul#fa_ticker_content').width(width_item).height(height_max).css('marginLeft','auto').css('marginRight','auto');
					$('ul#fa_ticker_content li').height(height_max);
				}


				$('#fa_ticker_content').jcarousel({
						vertical: slid_vert,
					wrap: 'circular',
					auto: {switch_ticker.STOP_TIME},
					auto_direction: auto_dir,
				scroll: 1,
				size: {switch_ticker.SIZE},
				height_max: height_max,
				animation: {switch_ticker.SPEED}
				});
			}
			else
			{
				$('ul#fa_ticker_content li:not(:first)').css('display','none');
				$('ul#fa_ticker_content li:first').css('list-style','none').css('text-align','center');
			}
		});
	//]]>
	</script>
	<!-- END switch_ticker_new -->

	<script type="text/javascript">//<![CDATA[
	$(document).ready(function(){
		<!-- BEGIN switch_enable_pm_popup -->
			pm = window.open('{U_PRIVATEMSGS_POPUP}', '_faprivmsg', 'HEIGHT=225,resizable=yes,WIDTH=400');
			if(pm != null) { pm.focus(); }
		<!-- END switch_enable_pm_popup -->
		<!-- BEGIN switch_report_popup -->
			report = window.open('{switch_report_popup.U_REPORT_POPUP}', '_phpbbreport', 'HEIGHT={switch_report_popup.S_HEIGHT},resizable=yes,scrollbars=no,WIDTH={switch_report_popup.S_WIDTH}');
			if(report != null) { report.focus(); }
		<!-- END switch_report_popup -->
		<!-- BEGIN switch_ticker -->
			$(document).ready(function() {
				Ticker.start({
					height : {switch_ticker.HEIGHT},
					spacing : {switch_ticker.SPACING},
					speed : {switch_ticker.SPEED},
					direction : '{switch_ticker.DIRECTION}',
					pause : {switch_ticker.STOP_TIME} 
				});
			});
		<!-- END switch_ticker -->
	});

	<!-- BEGIN switch_login_popup -->
		var logInPopUpLeft, logInPopUpTop, logInPopUpWidth = {LOGIN_POPUP_WIDTH}, logInPopUpHeight = {LOGIN_POPUP_HEIGHT}, logInBackgroundResize = true, logInBackgroundClass = false;
	<!-- END switch_login_popup -->

	<!-- BEGIN switch_login_popup -->
	$(document).ready( function() {
		$(window).resize(function() {
			var windowWidth = document.documentElement.clientWidth;
			var popupWidth = $("#login_popup").width();
			var mypopup = $("#login_popup");

			$("#login_popup").css({
			"left": windowWidth/2 - popupWidth/2
				});
		});
	});
	<!-- END switch_login_popup -->
	//]]>
	</script>
	{GREETING_POPUP}
	<style type="text/css">
	#page-footer, div.navbar, div.navbar ul.linklist {
	display: block !important;
	}
	ul.linklist li.rightside, ul.linklist li.rightside a.copyright {
	display: inline !important;
	}

	<!-- BEGIN switch_ticker_new -->
	.jcarousel-skin-tango .jcarousel-item {
		text-align:center;
		width: 10px;
	}

	.jcarousel-skin-tango .jcarousel-item-horizontal {
		margin-right: {switch_ticker.SPACING}px;
	}

	.jcarousel-skin-tango .jcarousel-item-vertical {
		margin-bottom: {switch_ticker.SPACING}px;
	}
	<!-- END switch_ticker_new -->
	</style>
	{HOSTING_JS}
	<!-- BEGIN google_analytics_code -->
	<script type="text/javascript">
		//<![CDATA[
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
				m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		ga('create', '{G_ANALYTICS_ID}', 'auto');
		ga('send', 'pageview');
		ga('set', 'anonymizeIp', true);

		<!-- BEGIN google_analytics_code_bis -->
		ga('create', '{G_ANALYTICS_ID_BIS}', 'auto', 'bis');
		ga('bis.send', 'pageview');
		ga('bis.set', 'anonymizeIp', true);
		<!-- END google_analytics_code_bis -->
		//]]>

	</script>
	<!-- END google_analytics_code -->
  <style>
    /**Tooltip**/
.ui-widget {
    -webkit-box-shadow: 1px 1px 3px #!important;
    box-shadow: 1px 1px 3px #000!important;
    border-radius: 0!important;
    background: var(--color-accent-2)!important;/*#bac1c6!important;*/
    color: #110d24!important;
}
/*Cuerpo del foro*/
#wrap {
    width: 1230px;
    margin: auto;
    padding: 70px 0 0;
    background-color: #ededed;  
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
}
#main {
  padding:0 20px;
}
body#phpbb {
    padding: 0;
  margin:0!important;
  color:#110d24;
}
#page-body {
    overflow: hidden;
}
a#logo {
    padding: 0;
}
.headerbar {
    padding: 0;
}
span.corners-bottom, span.corners-bottom span, span.corners-top, span.corners-top span {
  display:none;
}
/**Navbar**/
#fa_toolbar {
    width: 200px;
    left: 500px;
    min-width: 200px;
    overflow: hidden;
  z-index:1!important;
}
div#navbar {
    background:var(--color-accent-1);
    height: 70px;
    padding-left: 20px;
    position: fixed;
    top: 0;
    width: 1210px;
    z-index: 999;
  box-shadow: 0 1px 3px #000;
}
a.navbot {
    color: var(--color-accent-2)!important;
    display: inline-block;
    line-height: 15px;
    margin: 15px 2.5px;
    padding: 5px;
    text-align: center;
    text-shadow: 1px 1px 3px #000;
  position:relative;
  cursor:pointer;
}
div#navbar a.navbot span.sf {
    display: block;
    font-size: 15px;
    margin-top: 2px;
}
div#navright {
    float: right;
}
div#navwel {
border-bottom: 1px solid #000;
    color: #bfc4c8;
    display: inline-block;
    float: right;
    font-size: 17px;
    margin-left: 5px;
    margin-top: 10px;
    padding: 5px 20px;
    text-align: right;
    text-transform: uppercase;
    width: 310px;
    line-height: 11px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
div#navwel a {color: var(--color-accent-2);}
#navright img {
    border: 10px solid #000;
    float: left;
  width:50px;
  height:50px;
}
.simp .nonew, .nomp .yesnew {
    display: none;
}
.snomp .nonew, .simp .yesnew {
    display: inline-block;
}
a.navbot.yesnew #contador, a.navbot.notis #contador {
    width: 8px;
    height: 8px;
    display: block;
    position: absolute;
    top: 8px;
    right: -5px;
    border-radius: 100%;
    background: var(--color-contraste);
    font-size: 8px;
    line-height: 7px;
    text-shadow: none;
    font-weight: 900;
    color: #fff;
    padding: 1px;
}
a.navbot .sf {
    position: relative;
}
a.navbot span.sf.sf-group-1:before {
    display: inline-block!important;
    font-size: 24px!important;
    position: relative;
    top: 4px;
}
#logo-desc p, #page-header .navbar {
    display: none!important;
}
/*Notificaciones*/
div#notif {
    text-shadow: none;
    position: absolute;
    background: var(--color-accent-2);
    width: 200px;
    font-size: 10px;
    line-height: 10px;
    padding: 5px;
    left: 57px;
  top:55px;
    box-shadow: 1px 1px 3px #000;
  display:none;
  transition: all ease 1s;
}
div#notif:before {content: "▲";color: var(--color-accent-2);position: absolute;top: -6px;left: 100px;z-index: 1;}
a.navbot.notis #contador:empty {
    display: none;
}
div#notif ul#notif_list {
    height: 75px;
    overflow: auto;
}
div#notif ul#notif_list hr {
    display: none;
}
div#notif ul#notif_list li {
    display: block!important;
    position: relative;
    background: #ffffff2e;
    margin: 2px 5px 2px 0px;
    text-align: justify;
    padding: 5px;
}
div#notif ul#notif_list li .content {
    min-height: 20px;
}
div#notif ul#notif_list li a.delete {
    float: right;
    position: absolute;
    right: 6px;
}
div#notif ul#notif_list li .contentText.ellipsis {
    float: left;
    line-height: 10px;
    padding-right: 15px!important;
}
div#notif li a.delete:before {
    content: "\e0c5";
    font-family: "saturnicons"!important;
    font-size: 10px;
  color:var(--color-contraste);
}
div#notif li.see_all {
    padding: 10px;
    text-align: center;
    text-transform: uppercase;
    margin-top: 5px;
  display: block!important;
    position: relative;
    background: #ffffff2e;
}
div#navforo {
    text-align: right;
}
div#navforo a {
    color: var(--color-accent-2);
    cursor: pointer;
    display: inline-block;
    line-height: 15px;
    margin: 4px 2.5px;
    padding: 5px;
    position: relative;
    text-align: center;
    text-shadow: 1px 1px 3px #000;
}
  </style>
</head>

<body id="phpbb">
<!-- BEGIN hitskin_preview -->
<div id="hitskin_preview" style="display: block;">
	<h1><img src="https://2img.net/i/fa/hitskin/hitskin_logo.png" alt="" /> <em>Hit</em>skin.com</h1>
	<div class="content">
		<p>
			{hitskin_preview.L_THEME_SITE_PREVIEW}
			<br />
			<span>{hitskin_preview.U_INSTALL_THEME}<a href="https://{hitskin_preview.U_RETURN_THEME}">{hitskin_preview.L_RETURN_THEME}</a></span>
		</p>

	</div>
</div>
<!-- END hitskin_preview -->

<!-- BEGIN switch_login_popup -->
<div id="login_popup" style="z-index: 10000 !important;">
	<div class="h3">{SITENAME}</div>
	{LOGIN_POPUP_MSG}
	<div id="login_popup_buttons">
		<form action="{S_LOGIN_ACTION}" method="get">
			<input type="submit" class="button1" value="{L_LOGIN}" />
			<input type="button" class="button1" value="{L_REGISTER}" onclick="parent.location='{U_REGISTER}';" />
			<input id="login_popup_close" type="button" class="button2" value="{L_DONT_DISPLAY_AGAIN}" />
		</form>
	</div>
</div>
<!-- END switch_login_popup -->

<div class="conteneur_minwidth_IE">
<div class="conteneur_layout_IE">
<div class="conteneur_container_IE">
<div id="wrap">
	<a id="top" name="top" accesskey="t"></a>
	{JAVASCRIPT}

	<div id="page-header">
		<div class="headerbar">
                  <div id="navbar">
                    <a class="navbot" href="/" title="Home"><span class="sf sf-home"></span></a>
                    <a class="navbot" href="/memberlist" title="Idols"><span class="sf sf-group-1"></span></a>
                    <!-- BEGIN switch_user_logged_in -->
                    <a class="navbot" href="/profile?mode=editprofile" title="Editar perfil"><span class="sf sf-tools"></span></a>
                    <span class="nomp"><a class="navbot nonew" href="/privmsg?folder=inbox" title="No tienes nuevos mensajes"><span class="sf sf-envelope-2"></span></a>
                      <a class="navbot yesnew" href="/privmsg?folder=inbox" title="Tienes nuevos mensajes"><span class="sf sf-envelope-3"><span id="contador"></span></span></a></span>
                    <a class="navbot notis" title="Notificaciones"><span class="sf sf-bell"><span id="contador"></span></span></a>
                    <div id="notif"></div>
                    <a class="navbot lout" href="/login?logout=1" title="Desconectate"><span class="sf sf-battery-full"></span></a>
                    <!-- END switch_user_logged_in -->
                    <!-- BEGIN switch_user_logged_out -->
                    <a class="navbot" href="/register" title="Registrate"><span class="sf sf-plug"></span></a>
                    <a class="navbot" href="/login" title="Conectate"><span class="sf sf-battery-empty"></span></a>                    
                    <!-- END switch_user_logged_out -->
                    <div id="navright">
                      <!-- BEGIN switch_user_logged_in --> <img /><!-- END switch_user_logged_in -->
                      <!-- BEGIN switch_user_logged_out --> <img src="http://placehold.co/50x50"/><!-- END switch_user_logged_out -->
                      <div id="navwel">Bienvenido  
                      <!-- BEGIN switch_user_logged_out --> invitado<!-- END switch_user_logged_out -->
                        <!-- BEGIN switch_user_logged_in --> <span id="navidnick"></span><!-- END switch_user_logged_in -->
                      </div>
                      <div id="navforo">
                        <!-- BEGIN switch_user_logged_in -->
                        <a href="{U_SEARCH_NEW}" title="{L_SEARCH_NEW}"><span class="sf sf-chronometer"></span></a>
                        <a href="{U_SEARCH_SELF}" title="{L_SEARCH_SELF}"><span class="sf sf-cheers"></span></a>
			<!-- END switch_user_logged_in -->
                        <a href="{U_SEARCH_UNANSWERED}" title="{L_SEARCH_UNANSWERED}"><span class="sf sf-lightbulb"></span></a>
                        <!-- BEGIN switch_user_logged_in -->
                        <a href="/search?search_id=watchsearch" title="Temas supervisados"><span class="sf sf-book"></span></a>
                        <a href="{U_MARK_READ}" title="{L_MARK_FORUMS_READ}"><span class="sf sf-check-2"></span></a>                        
                        <a href="/?mode=delete_cookies" style="float:left; margin-left:10px;" rel="nofollow" title="Suprimir las cookies del foro"><span class="sf sf-cookies"></span></a>
                        <!-- END switch_user_logged_in -->
              		
                      </div>
                    </div>
                  </div>
			<div class="inner"><span class="corners-top"><span></span></span>

			<div id="logo-desc">
				<a href="{U_INDEX}" id="logo"><img src="{LOGO}" alt="{L_INDEX}" /></a>
				<!-- BEGIN switch_h1 -->
				<div id="site-title">{switch_h1.MAIN_SITENAME}</div>
				<!-- END switch_h1 -->
				<!-- BEGIN switch_desc -->
				<p>{switch_desc.SITE_DESCRIPTION}</p>
				<!-- END switch_desc -->
			</div>

			<span class="corners-bottom"><span></span></span></div>
		</div>

		<div class="navbar">
			<div class="inner"><span class="corners-top"><span></span></span>

			<ul class="linklist navlinks{NAVBAR_BORDERLESS}">
			<li>{GENERATED_NAV_BAR}</li>
			</ul>

			<!-- BEGIN switch_search_box -->
			<div id="search-box">
				<form method="get" action="{ACTION_SEARCH}" id="search">
					<p class="nomargin"><input type="text" name="search_keywords" id="keywords" maxlength="128" class="inputbox search" value="{L_SEARCH}..." onclick="if (this.value == '{L_SEARCH}...') this.value = '';" onblur="if (this.value == '') this.value = '{L_SEARCH}...';" />
					{JS_SESSION_ID_INPUT}
					<input class="button2" type="submit" value="{L_SEARCH}" /></p>
				</form>
			</div>
			<!-- END switch_search_box -->

			<span class="corners-bottom"><span></span></span></div>
		</div>

		<!-- BEGIN switch_ticker_new -->
		<div id="fa_ticker_blockD" style="margin-top:4px;">
			<div class="module">
				<div class="inner">
					<span class="corners-top"><span></span></span>
						<div id="fa_ticker_container">
							<ul id="fa_ticker_content" class="jcarousel-skin-tango" style="display:none">
								<!-- BEGIN ticker_row -->
								<li>{switch_ticker.ticker_row.ELEMENT}</li>
								<!-- END ticker_row -->
							</ul>
						</div>
					<span class="corners-bottom"><span></span></span>
				</div>
			</div>
		</div>
		<!-- END switch_ticker_new -->

		<!-- BEGIN switch_ticker -->
		<div id="fa_ticker_block" style="margin-top:4px;">
			<div class="module">
				<div class="inner">
					<span class="corners-top"><span></span></span>
						<div id="fa_ticker_container">
							<div id="fa_ticker" style="height:{switch_ticker.HEIGHT}px;">
								<div class="fa_ticker_content">
									<!-- BEGIN ticker_row -->
									<div>{switch_ticker.ticker_row.ELEMENT}</div>
									<!-- END ticker_row -->
								</div>
							</div>
						</div>
					<span class="corners-bottom"><span></span></span>
				</div>
			</div>
		</div>
		<!-- END switch_ticker -->
	</div>

	<div id="page-body">

	<div id="{ID_CONTENT_CONTAINER}"{CLASS_CONTENT_CONTAINER}>
		<div id="outer-wrapper">
			<div id="wrapper">
				<div id="container">
					<div id="content">

         <div id="{ID_LEFT}">
							<!-- BEGIN giefmod_index1 -->
							{giefmod_index1.MODVAR}
							<!-- BEGIN saut -->
							<!-- END saut -->
							<!-- END giefmod_index1 -->
						</div>

						<div id="main">
							<div id="main-content">