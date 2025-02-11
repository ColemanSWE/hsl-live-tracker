# HSL Real-Time Tracker

## Approach

- The first step was to decide on an HSL API. They have a ton of very useful and well-documented, interesting APIs, as well as old information floating around for endpoints/APIs that are deprecated (with V2s and V3s) or otherwise not in use. I decided on the MQTT live info endpoint, as MQTT was an unfamiliar protocol to me and I've never had the chance to make a web app that updates so frequently with new information.

- The second step was deciding what to do with the data. The most obvious idea for something to do with data of this nature (includes coordinates, speed, etc. and is live-updating) was to map it! I'm not super knowledgeable on working with mapping systems, but Leaflet ending up being a quite simple and effective solution. It executed my idea pretty much out-of-the-box with quite a simple setup. The other components were (in my opinion) less interesting but more in my wheelhouse. Data visualisation using tables and charts is something I worked with more extensively, and the table for example was simple enough to even do using just vanilla HTML tags with a Sass module along with it (no component library needed!). For the chart I ended up going with Recharts, as it feels like a good middle ground of customisability between using vanilla D3.js and using a component library. Also I was writing tests for components as I went, relying on Jest to run the tests.

- The third step after writing the components and achieving a layout for the page I was satisfied with was optimisation. I will discuss this more in-depth in the challenges section, but the long and short of it was that the leaflet map that I used to display the vehicles moving felt really laggy and slow when zooming or panning the map, so I took some steps to make it smoother.

- Everything after these main steps was spent with things like making the app responsive on mobile and refactoring the structure of the app where it made sense (consolidated the table app to include the filter controls and pagination, even though they are separate components in themselves, for example as I felt it made sense to group these things together as they're tightly coupled). I also spent some time "prettying up" some components. For example I made custom markers for the map that show vehicle type, and are colour-coded based on HSL own colours.

- Also somewhere in-between these steps I set up CI/CD using GitHub actions. This included having tests running on each PR, merges to main requiring PRs (handled through branch protection rules in the GitHub repo settings), and having the page automatically deploy through GitHub Pages after every merge to main. I was also working on an action that would deploy a preview of a PR after every push to the PRs base branch, but ended up abandoning it as I was spending way too much time on it because I'm not super familiar with configuring GitHub Actions/Pages.

## Challenges Faced

- **Choice paralysis**: As I mentioned in my approach, HSL has way more publicly available information than I would've guessed. And from my browsing, it seems that nearly everything available is high-quality with quite good documentation.

- **MQTT**: This protocol was one that I don't believe I've even heard of prior to this project. It was interesting to learn about and it became immediately obvious why certain systems would want a protocol that works this way. That being said, I was mostly in the dark when it came to implementing MQTT. I had to learn a bit about how it works and what was available for use in the JS ecosystem as far as consuming the information that comes from the broker.

- **Map systems**: Another aspect of frontend that I'm not super knowledgeable on is map systems. After some quick research I ended choosing leaflet for its simplicity and strong support.

- **Map optimisation**: In the beginning when I connected the live data to the map view, the map was pretty sluggish. By simply displaying/updating the data at a slower rate using throttling, the map became much more quick and responsive.

- **Deployment**: Spent a bit too much time trying to be fancy with the PR actions (particularly trying to get PR previews working).

- **Mobile responsiveness**: Forgot to periodically check different screen sizes during development, which made retrofitting responsive styles more time-consuming.

## Potential Improvements

1. **Accessibility**: Could do more to ensure the site meets WCAG standards through proper ARIA labels and contrast ratios.

2. **Map optimisation**: Explore alternative solutions to throttling that might preserve more real-time accuracy while maintaining performance.

3. **Design**: Refine color scheme to better match HSL's branding while improving readability.

4. **Pagination architecture**: Implement a hybrid approach combining frontend pagination with periodic server-side data refreshes.

5. **Enhanced testing**: Add end-to-end testing for map interactions and MQTT connection stability.

## Deployment

The application is automatically deployed via GitHub Pages at:  
[https://colemanswe.github.io/hsl-realtime-tracker](https://colemanswe.github.io/hsl-realtime-tracker)
