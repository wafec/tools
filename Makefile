denorun = cd apps/investor; deno run dev $(1)

reit-rank:
	$(call denorun,reit rank data/reits.json data/reits.csv)

reit-rank-html-download:
	@mkdir -p apps/investor/data/reits
	$(call denorun,reit rank-html-download --max 200 data/reits.csv data/reits) 

reit-rank-with-dividend-variance:
	$(call denorun,reit rank-with-dividend-variance data/reits.csv data/reits data/reits-with-variance.csv)
