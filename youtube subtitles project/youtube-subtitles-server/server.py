from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound

app = Flask(__name__)
CORS(app)  # Enable CORS for the Flask app

@app.route('/get_subtitles', methods=['GET'])
def get_subtitles():
    video_id = request.args.get('video_id')
    if not video_id:
        return jsonify({'error': 'Missing video_id parameter'}), 400

    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
        subtitles = ' '.join([entry['text'] for entry in transcript])
        return jsonify({'subtitles': subtitles})
    except TranscriptsDisabled:
        return jsonify({'error': 'Transcripts are disabled for this video'}), 403
    except NoTranscriptFound:
        try:
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            transcript = None

            # Try to find manually created transcripts in 'en-IN'
            if 'en-IN' in [t.language_code for t in transcript_list]:
                transcript = transcript_list.find_transcript(['en-IN'])
            # If not found, try to find generated transcripts in 'hi' (Hindi)
            elif 'hi' in [t.language_code for t in transcript_list]:
                transcript = transcript_list.find_transcript(['hi'])

            if transcript:
                transcript_data = transcript.fetch()
                subtitles = ' '.join([entry['text'] for entry in transcript_data])
                return jsonify({'subtitles': subtitles})
            else:
                return jsonify({'error': 'No suitable transcript found'}), 404

        except Exception as e:
            return jsonify({'error': str(e)}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
