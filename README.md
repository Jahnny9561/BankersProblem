# Banker's Problem Simulator

An interactive desktop application that simulates the Banker's Algorithm for Deadlock Avoidance in Operating Systems. Built using a Hybrid Architecture (React Frontend + Rust Backend), this tool gamifies the resource allocation process.

Users act as the System Kernel, allocating limited resources to processes (P0-P7). The goal is to find a "Safe Sequence" to execute all processes without entering an unsafe state.

>Banker's Algorithm: A resource allocation and deadlock avoidance algorithm. It ensures the system remains in a safe state by calculating if a grant will lead to a theoretical deadlock.

>Deadlock: A situation where two or more processes are unable to proceed because each is waiting for the other to release a resource.

## Features

- Interactive Simulation: Manual "Step-by-step" or "Instant" execution modes.
- Visual Kernel: See the algorithm's decision-making process in real-time.
- Level Generator: Randomize the system state for endless puzzles.
- Dual Language Support: Instant switching between English and Bulgarian.

## Installation
- ### Windows Installer (Recommended)
  -  You can download the **.msi** installer from the Release branch [https://github.com/Jahnny9561/BankersProblem/releases/tag/v1.0.0]
- ### Compile the project yourself
  **Prerequisites:**
  + Node.js (LTS)
  + Rust & Cargo
  + C++ Build Tools (Windows)
  ### Steps
    Clone the repository:
    
   ```bash
   git clone https://github.com/Jahnny9561/BankersProblem.git
   cd BankersProblem
   ```
  Install dependencies:
  ```bash
  npm install
  ```

  Run in Development Mode:
  ```bash
  npm run tauri dev
  ```

## Usage

### 1. Setup Phase
Configure the system parameters on the left panel. You can manually change the number of Processes (8 Max) and Total Resources, enter the **Max Claims** and **Allocated Resources** for each process, or click the **Randomize** button to generate a solvable puzzle. **Start the simulation.**

<img width="805" height="998" alt="Image" src="https://github.com/user-attachments/assets/8f7788e8-a521-4d17-987c-0926a099750c" />

### 2. Simulation Phase

Once started, the system enters "Kernel Mode."
* **Request Resources:** Click `+1 Request` on a process.
* **Visualizer:** Watch the kernel logic in the black terminal box.
* **Safety Check:** If a request leads to an unsafe state (Deadlock), the system will **Deny** it and the button will turn red.

<img width="1112" height="995" alt="Image" src="https://github.com/user-attachments/assets/dbd8fc81-60cd-41e4-8ce8-33578b02ff0d" />

## Future updates

The project is currently feature-complete for the course requirements, but the following updates are planned:

- **Stress Mode (Time-Attack):** implementing a countdown timer where the user must allocate resources under pressure, simulating real-time OS scheduling constraints.
- **Realistic Process Identities:** Replacing generic identifiers (P0, P1) with realistic executable names (e.g., `kernel.exe`, `chrome.exe`, `discord_updater`) and icons to mimic a real Task Manager environment.

## License

BankersProblem is made available under the MIT [License](./LICENSE)
   
