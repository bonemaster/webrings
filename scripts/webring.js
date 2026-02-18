
window.onload = (event) => {
	const webringElement = document.getElementById(ringtagId);

	let template = `
					<style>
					dialog.#RINGTAG#_dialog {
					  padding: 20px;
					  border-radius: 8px;
					  border: 1px solid #ddd;
					  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
					  max-width: 800px;
					}
					
					dialog.#RINGTAG#_dialog::backdrop {
					  background-color: rgba(0,0,0,0.6);  
					}
					
					.current {
						font-weight: bold;
						background-color: rgba(255,212,7,0.27);
					}
					.#RINGTAG#_link {
						text-decoration: underline;
						cursor: pointer;
					}
					
					.#RINGTAG#_div {
					  display: grid;
					  place-items: center; 
					}
					</style>
					<div>
					<div class="#RINGTAG#_div">
					<img src="#WEBRING_LOGO#" title="#WEBRING_NAME#" alt="#WEBRING_NAME#">
						<div>
							<a id="#RINGTAG#_prev" class="#RINGTAG#_link">Previous</a> | <a id="#RINGTAG#_list" class="#RINGTAG#_link" title="List of Sites in Webring">List</a> | <a id="#RINGTAG#_join" class="#RINGTAG#_link" title="How to Join This Webring">Join</a> | <a id="#RINGTAG#_random" class="#RINGTAG#_link">Random Site</a> | <a id="#RINGTAG#_next" class="#RINGTAG#_link">Next</a>
						</div>
					</div>
					</div>
					<dialog id="#RINGTAG#_list_dialog" class="#RINGTAG#_dialog">
						<h4>#WEBRING_NAME# Site List</h4>
						<ul id="site_list">
						</ul>
						<button onclick="document.getElementById('#RINGTAG#_list_dialog').close();">Close</button>
					</dialog>
					<dialog id="#RINGTAG#_join_dialog" class="#RINGTAG#_dialog">
						<h4>Join #WEBRING_NAME#</h4>
						<p>#WEBRING_DESCRIPTION#</p>
						<br />
						Please conact #WEBRING_OWNER# for more information at <a href="mailto:#WEBRING_CONTACT#">#WEBRING_CONTACT#</a>.
						<br /><br />
						<button onclick="document.getElementById('#RINGTAG#_join_dialog').close();">Close</button>
					</dialog>
`;

	fetch(ringdataURL)
		.then((response) => response.json())
		.then((webring) => {
			let siteLength = webring.sites.length;
			let prevId = 0;
			let nextId = 0;
			let currentIndex = 0;

			let listOfUrls = '';

			webring.sites.forEach((site) => {
				console.log(site);
				current = '';
				if(site.url.trim() == memeberURL.trim()) {
					currentIndex = webring.sites.indexOf(site);
					current = 'current';
					prevId = currentIndex - 1;
					nextId = currentIndex + 1;
					if(prevId < 0) {
						prevId = siteLength - 1;
					}
					if(nextId >= siteLength) {
						nextId = 0;
					}
				}
				listOfUrls += `<li class="${current}"><a href="${site.url}">${site.name} </a></li>`;
			})
			let randomId = Math.floor(Math.random() * siteLength );
			while(randomId == currentIndex) {
				randomId = Math.floor(Math.random() * siteLength );
			}
			// update template with data
			template = template.replace(/#WEBRING_NAME#/g,  webring.name);
			template = template.replace(/#WEBRING_OWNER#/g,  webring.owner);
			template = template.replace(/#WEBRING_CONTACT#/g, webring.contact);
			template = template.replace(/#WEBRING_DESCRIPTION#/g, webring.description);
			template = template.replace(/#WEBRING_LOGO#/g, webring.logo);
			template = template.replace(/#RINGTAG#/g, ringtagId);

			webringElement.innerHTML = template;

			document.getElementById("site_list").innerHTML = listOfUrls;
			document.getElementById(`${ringtagId}_list`).addEventListener('click',function() {
				document.getElementById(`${ringtagId}_list_dialog`).showModal();
			});
			document.getElementById(`${ringtagId}_join`).addEventListener('click',function() {
				document.getElementById(`${ringtagId}_join_dialog`).showModal();
			});
			document.getElementById(`${ringtagId}_prev`).addEventListener('click',function() {
				window.location.href = webring.sites[prevId].url;
			})
			document.getElementById(`${ringtagId}_prev`).title =  webring.sites[prevId].url;
			document.getElementById(`${ringtagId}_next`).addEventListener('click',function() {
				window.location.href = webring.sites[nextId].url;
			});
			document.getElementById(`${ringtagId}_next`).title =  webring.sites[nextId].url;
			document.getElementById(`${ringtagId}_random`).addEventListener('click',function() {
				window.location.href = webring.sites[randomId].url;
			})
			document.getElementById(`${ringtagId}_random`).title =  webring.sites[randomId].url;
		});
};


