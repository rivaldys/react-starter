# React Starter
A React boilerplate with Atomic Design methodology. This boilerplate also includes libraries that support basic features such as **_fetching_**, **_global state management_**, and **_routing systems_**. Built with the power of `React` and `Vite`.

### _# Main idea_

The main idea of this boilerplate is to bundle things up that you need on starting a frontend project without manually configuring the routing library, fetching library, defining directory structure, etc.

### _# Then, in this boilerplate, what does the Atomic Design use for?_

Atomic Design in design concept generally categorizes the component/element from the smallest to the biggest one (hence the name "atomic", adopted from physics term). In frontend development or in programming in general, prioritizing the usage of components that can be reused again and again (reusable components) is such a good idea for good development, programming experience, maintainability, etc. In other words, this concept covers enough for that thing. This boilerplate implements the concept of Atomic Design in its directory structure.

## &#10095; Preview
<img width="700" alt="react-starter_home" src="https://github.com/rivaldys/react-starter/assets/76983038/8394df42-d1ee-4782-b2b6-3bc73595bd83">
<img width="700" alt="react-starter_about" src="https://github.com/rivaldys/react-starter/assets/76983038/c27f9d63-76b3-401a-a816-e4aabb01c735">

## &#10095; Features
- Fetching library: `axios`
- State management: `redux`
- Routing systems: `react-router-dom`
- Absolute imports
- Custom app's port
- Custom hooks:
   - useEventListener
   - useForm
   - useNetworkStatus

## &#10095; Installation Prerequisites
The following are required to be able to run this application:
- Node.js v18
- pnpm (package manager)

## &#10095; Development
For development purposes, before running this application please do some necessary preparations including: installing dependencies, and setting environment variables in the `.env.development` file.

### &#10102; Dependencies Installation
   Command:
   ```shell
   npm install -g pnpm
   ```

   ```shell
   pnpm install
   ```
   ___

### &#10103; Setting the Environment Variable
Please copy or duplicate the `.env.example` file into `.env.development` (specific to the development version) or `.env` and adjust each variable. If you want to copy the file automatically, you can run the command below in the terminal and adjust each variable.

Command:
   ```shell
   cp .env.example .env.development
   ```
   ---

### &#10104; Running the App
   Command:
   ```shell
   pnpm dev
   ```

## &#10095; Author
This documentation was written by [Ahmad Rivaldy S](https://rivaldy.net)