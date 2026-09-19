# OCSS website
## Dev environment
- Install [Hugo](https://gohugo.io/installation/)
- Run `git submodule update --init`
- Run `hugo server`

### Notes for future developers
- Hugo won't publish pages if the date field of the front matter is in the future. If you want to see these pages, run `hugo server -F`

## Deployment
Any changes to this repository should be automatically mirrored to ocss.nz
