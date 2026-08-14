(function () {
	var KEY_T = "ontap-theme";
	var KEY_C = "ontap-contrast";
	var root = document.documentElement;
	var memT = null;
	var memC = null;

	function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
	function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

	function getTheme() { return memT || lsGet(KEY_T) || "auto"; }
	function setTheme(v) { memT = v; lsSet(KEY_T, v); }
	function getContrast() { return memC || lsGet(KEY_C) || "normal"; }
	function setContrast(v) { memC = v; lsSet(KEY_C, v); }

	// URL overrides: ?theme=dark|light&contrast=high|normal (also shareable)
	try {
		var qs = new URLSearchParams(location.search);
		var qt = qs.get("theme");
		var qc = qs.get("contrast");
		if (qt === "dark" || qt === "light") setTheme(qt);
		if (qc === "high" || qc === "normal") setContrast(qc);
	} catch (e) {}

	function sysDark() {
		return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
	}

	function apply() {
		var t = getTheme();
		var dark = t === "dark" || (t === "auto" && sysDark());
		var high = getContrast() === "high";
		root.classList.toggle("theme-dark", dark);
		root.classList.toggle("contrast-high", high);
		var bt = document.getElementById("themeToggleBtn");
		if (bt) {
			bt.querySelector(".tt-ico").textContent = dark ? "\uD83C\uDF19" : "\u2600\uFE0F";
			bt.querySelector(".tt-label").textContent = dark ? "T\u1ed1i" : "S\u00e1ng";
			bt.setAttribute("aria-pressed", dark ? "true" : "false");
		}
		var bc = document.getElementById("contrastToggleBtn");
		if (bc) bc.setAttribute("aria-pressed", high ? "true" : "false");
	}

	apply();
	if (window.matchMedia) {
		try { window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", apply); } catch (e) {}
	}

	function onReady(fn) {
		if (document.readyState !== "loading") fn();
		else document.addEventListener("DOMContentLoaded", fn);
	}

	onReady(function () {
		var box = document.createElement("div");
		box.className = "theme-switcher";
		box.setAttribute("role", "group");
		box.setAttribute("aria-label", "Ch\u1ebf \u0111\u1ed9 hi\u1ec3n th\u1ecb");

		var b1 = document.createElement("button");
		b1.id = "themeToggleBtn";
		b1.type = "button";
		b1.title = "Chuy\u1ec3n n\u1ec1n s\u00e1ng / t\u1ed1i";
		b1.innerHTML = '<span class="tt-ico">\u2600\uFE0F</span><span class="tt-label">S\u00e1ng</span>';
		b1.addEventListener("click", function () {
			var dark = root.classList.contains("theme-dark");
			setTheme(dark ? "light" : "dark");
			apply();
		});

		var b2 = document.createElement("button");
		b2.id = "contrastToggleBtn";
		b2.type = "button";
		b2.title = "B\u1eadt / t\u1eaft t\u01b0\u01a1ng ph\u1ea3n cao";
		b2.innerHTML = '<span class="tt-ico">\u25d0</span><span class="tt-label">T\u01b0\u01a1ng ph\u1ea3n</span>';
		b2.addEventListener("click", function () {
			setContrast(getContrast() === "high" ? "normal" : "high");
			apply();
		});

		box.appendChild(b1);
		box.appendChild(b2);
		document.body.appendChild(box);
		apply();
	});
})();
