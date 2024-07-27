from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound

app = Flask(__name__)
CORS(app)

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

            # Accessing manually created transcripts
            try:
                transcript = transcript_list.find_manually_created_transcript(['en-IN'])
            except Exception:
                pass
            
            # If no manually created transcripts, try generated transcripts
            if not transcript:
                try:
                    transcript = transcript_list.find_generated_transcript(['hi'])
                except Exception:
                    pass

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

@app.route('/convert_to_sign_language', methods=['POST'])
def convert_to_sign_language():
    data = request.json
    subtitles = data.get('subtitles', '')
    if not subtitles:
        return jsonify({'error': 'Missing subtitles parameter'}), 400

    # Mock sign language conversion
    sign_language = ''.join(['🤟' for char in subtitles])  # Replace with actual conversion logic
    return jsonify({'sign_language': sign_language})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
