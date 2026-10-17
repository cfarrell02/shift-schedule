# Four Shift Schedule Generator

This project is a web application that generates a four-shift schedule based on user inputs. It utilizes React and Material-UI for the frontend and provides a simple interface to input details regarding the shift schedule.

## Functionality

- **Any rota pattern**: Build the repeating cycle from blocks (e.g. 2 day shifts, 2 night shifts, 4 days off) and pick any date on which a cycle starts. Dates before or after that work.
- **Custom shift types**: Add your own shift types (e.g. long days) with a name, a short code, a colour and optional stripes.
- **Yearly view**: See the whole year month by month, with each day's shift colour and code, neighbouring months' days filling the grid, and today highlighted. It scales down to fit phones.
- **Export**: Download the schedule as a PDF or PNG, or as an `.ics` file to add your shifts to Google, Apple or Outlook calendars.
- **Saved and shareable**: Your settings are kept in your browser, and "Copy share link" makes a link that opens the same schedule anywhere.

## Components

- **Four Shift Schedule**: Main component holding the settings, controls, preview and exports.
- **Pattern Editor**: Edits the blocks that make up the repeating cycle.
- **Palette Creator**: Edits the shift types and their colours.
- **Schedule Grid / Month Schedule**: The yearly grid of months with colour-coded shifts.
- **Scale To Fit**: Shows the fixed-width export layout scaled down on small screens.
- **Footer**: A simple footer with a GitHub link to the project repository.

Schedule calculation, settings and exports live in `src/lib` as plain functions, covered by unit tests (`npm test`).

## Usage

1. Pick the first day of any cycle, then set up the pattern's blocks.
2. Optionally customise shift types and colours, and choose the year to show.
3. The schedule updates as you go. Download it as a PDF, PNG or calendar file, or copy a share link.

## Installation

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Start the application using `npm start`.
4. Access the application in your browser at `http://localhost:3000/shift-schedule/`.

## Technologies Used

- React
- Material-UI
- HTML/CSS

