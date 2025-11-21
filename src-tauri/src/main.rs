#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::command;

//Define the structure of the answer we send back to React
#[derive(serde::Serialize)]
struct SafetyResult {
    is_safe: bool,
    log: String,
}

//The Actual Banker's Algorithm (The "Brain")
#[command]
fn check_safety(
    num_processes: usize,
    max_table: Vec<i32>,
    alloc_table: Vec<i32>,
    available: i32,
) -> SafetyResult {
    //Clone variables to create a simulation sandbox
    let mut work = available;
    let mut finish = vec![false; num_processes];

    //Loop control variables
    let mut found = true;

    //The Algorithm: Keep looping as long as we find a process that can finish
    while found {
        found = false;
        for i in 0..num_processes {
            if !finish[i] {
                let need = max_table[i] - alloc_table[i];

                // Can we satisfy this process?
                if need <= work {
                    // Yes! Simulate it running and returning resources
                    work += alloc_table[i];
                    finish[i] = true;
                    found = true;
                }
            }
        }
    }

    // If everyone finished, the state is SAFE
    let is_safe = finish.iter().all(|&x| x);

    let log_message = if is_safe {
        "Rust Kernel: State is SAFE".to_string()
    } else {
        "Rust Kernel: DEADLOCK DETECTED".to_string()
    };

    SafetyResult {
        is_safe,
        log: log_message,
    }
}

fn main() {
    tauri::Builder::default()
        // 3. Register the function so the Frontend can find it
        .invoke_handler(tauri::generate_handler![check_safety])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
