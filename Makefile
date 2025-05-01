denorun = cd apps/investor; deno run dev $(1)

MAX_HTML_DOWNLOAD = 500

reit-rank:
	$(call denorun,reit rank data/reits.json data/reits.csv)

reit-rank-html-download:
	@mkdir -p apps/investor/data/reits
	$(call denorun,reit rank-html-download --max $(MAX_HTML_DOWNLOAD) data/reits.csv data/reits) 

reit-rank-with-dividend-variance:
	$(call denorun,reit rank-with-dividend-variance data/reits.csv data/reits data/reits.json data/reits-with-variance.csv)
