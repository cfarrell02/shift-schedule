# Four Shift Schedule Generator

This project is a web application that generates a four-shift schedule based on user inputs. It utilizes React and Material-UI for the frontend and provides a simple interface to input details regarding the shift schedule.

## Functionality

- **Input Parameters**: Users can input the first day of the schedule, the number of day shifts, night shifts, and days off.
- **Schedule Generation**: Based on the provided inputs, the application generates a yearly schedule displaying day shifts, night shifts, and days off.
- **Visual Representation**: The schedule is presented in a grid/table format, showcasing shifts for each day of the year.
- **Month View**: Users can view monthly schedules in a tabular format, with color-coded representation of shifts.

## Components

- **Four Shift Schedule**: Main component allowing users to input details and generate the schedule.
- **Schedule Grid**: Displays the yearly schedule in a grid/table format.
- **Month Schedule**: Component showcasing the monthly schedule with color-coded shifts.
- **Footer**: A simple footer with a GitHub link to the project repository.

## Usage

1. Enter the first day of the block of working days and the number of day shifts, night shifts, and days off.
2. Click on "Generate Schedule" to create the yearly schedule.
3. The schedule will be displayed in a grid, with options to download as PDF.

## Installation

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Start the application using `npm start`.
4. Access the application in your browser at `http://localhost:3000/shift-schedule/`.

## Technologies Used

- React
- Material-UI
- HTML/CSS

