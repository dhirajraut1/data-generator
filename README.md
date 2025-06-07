# Mock Data Generator

A powerful web application for generating customizable mock data using pattern matching. Ideal for testing, development, and data visualization projects.

## ✨ Features

- **Custom Data Generation**: Create multiple data columns with unique patterns
- **Multiple Export Formats**: Download data as CSV or Excel (XLSX)
- **Advanced Pattern Matching**: Support for various data types and formats
- **Responsive Design**: Works seamlessly on both desktop and mobile devices
- **Real-time Preview**: See generated data in a clean, tabular format
- **Bulk Generation**: Generate hundreds or thousands of records with a single click
- **User-friendly Interface**: Intuitive form-based interface with helpful tooltips

## 🛠 Pattern Guide

### Basic Patterns

- `#` - Random digit (0-9)
- `$` - Random lowercase letter (a-z)
- `###-###-####` - Format numbers (e.g., phone numbers)

### Advanced Patterns

- `#[min-max]` - Random number in range (e.g., `#[1-9]` for 1-9)
- `$[a-z]` - Random lowercase letter in range (e.g., `$[a-f]` for a-f)
- `$[A-Z]` - Random uppercase letter in range (e.g., `$[A-F]` for A-F)
- `["value1", "value2"]` - Random selection from array (e.g., `["Active", "Inactive"]`)

## 📝 Examples

| Data Type     | Pattern Example           | Sample Output           |
| ------------- | ------------------------- | ----------------------- |
| Phone Number  | `+1-###-###-####`         | +1-555-123-4567         |
| Email         | `user_$$$####@domain.com` | user_abc1234@domain.com |
| Custom ID     | `ID-####-$$$`             | ID-1234-xyz             |
| Age Range     | `#[18-65]`                | 34                      |
| Status        | `["Active", "Inactive"]`  | Active                  |
| Nepali Mobile | `+977-98#######`          | +977-9841234567         |

Add Patterns
![image](https://github.com/user-attachments/assets/e615722b-a8e9-4429-8e01-9cd1debb6198)

Generate and Download Data as CSV or XLSX.
![image](https://github.com/user-attachments/assets/47827c19-6b85-4457-9556-98b388d0479c)


## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Open `index.html` in your preferred web browser

### Usage

1. **Add Columns**: Click "Add Column" to create new data fields
2. **Define Fields**:
   - Enter a column name (e.g., "Email", "Phone")
   - Specify a pattern (e.g., `user_####@domain.com`)
3. **Set Record Count**: Choose how many records to generate
4. **Generate Data**: Click "Generate Data" to create your dataset
5. **Export**: Download the data as CSV or Excel

## 🌟 Tips

- Use `#` for numeric placeholders and `$` for alphabetic ones
- Combine patterns with static text (e.g., `ID-###-$$`)
- For large datasets, consider generating in smaller batches for better performance
- The preview shows the first 100 rows, but all data will be included in the export

## 🛠️ Built With

- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [SheetJS](https://sheetjs.com/) - For Excel export functionality
- Vanilla JavaScript
