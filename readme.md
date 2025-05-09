# YouTube Data Extractor

This project is an API and web interface to extract information about YouTube videos and channels. It uses `puppeteer` to scrape video and channel pages and retrieve data such as title, description, views, likes, and more.

## Features

- **Video Information**: Retrieve data like title, description, publish date, views, likes, dislikes, hashtags, and more.
- **Channel Information**: Retrieve data about a channel including name, image, subscribers, latest videos, and more.
- **REST API**: Access data through API endpoints in JSON format.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side code.
- **Express**: Web framework for building the application.
- **Puppeteer**: Library for web scraping, especially useful for YouTube.
- **EJS**: Template engine for rendering HTML pages on the server.
- **JavaScript/HTML/CSS**: For the web interface.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/171ntw/youtube-data-extractor.git
   ```

2. Navigate to the project folder:
   ```bash
   cd youtube-data-extractor
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm start
   ```

The server will run at [http://localhost:3000](http://localhost:3000).

## Endpoints

### **GET /info/video**
Displays information of a YouTube video on a webpage.

**Parameters**:
- `url` (query string): The URL of the video.

**Example**:
```text
http://localhost:3000/info/video?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

### **GET /info/channel**
Displays information of a YouTube channel on a webpage.

**Parameters**:
- `url` (query string): The URL of the channel.

**Example**:
```text
http://localhost:3000/info/channel?url=https://www.youtube.com/c/ExampleChannel
```

### **GET /api/info/video**
Returns the information of a video in JSON format.


**Parameters**:
- `url` (query string): The URL of the video.
**Example**:
```text
http://localhost:3000/api/info/video?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

### **GET /api/info/channel**
Returns the information of a channel in JSON format.

**Parameters**:
- `url` (query string): The URL of the channel.

**Example**:
```text
http://localhost:3000/api/info/channel?url=https://www.youtube.com/c/ExampleChannel
```

## Example Response Data

### **Video Data**
```json
{
  "video": {
    "title": "Video Title",
    "description": "Video Description",
    "publishDate": "Publish Date",
    "views": "1,000,000 views",
    "likes": "100,000 likes",
    "dislikes": null,
    "hashtags": ["#hashtag1", "#hashtag2"],
    "duration": "10:30",
    "thumbnail": "Thumbnail URL",
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  "channel": {
    "name": "Channel Name",
    "url": "https://www.youtube.com/c/ExampleChannel",
    "subscribers": "10,000,000 subscribers",
    "image": "Channel Image URL"
  }
}
```

### **Channel Data**
```json
{
  "channel": {
    "name": "Channel Name",
    "image": "Channel Image URL",
    "subscribers": "10,000,000 subscribers",
    "total": {
      "videos": "500 videos"
    },
    "videos": [
      {
        "title": "Video Title",
        "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
      },
      {
        "title": "Another Video",
        "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
      }
    ]
  }
}