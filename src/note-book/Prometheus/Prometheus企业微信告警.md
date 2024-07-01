# Prometheus企业微信告警

> 刚刚在微信的文件里看到的，不知道那个群里的。看起来是好用的脚本

## 脚本

```bash
from flask import Flask, request, jsonify
import requests
import json

app = Flask(__name__)

def send_message_to_enterprise_wechat(message, color="info"):
    enterprise_wechat_webhook = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=e936d170-44f7-4cd2-a62f-db9cbb6119xx"
    headers = {'Content-Type': 'application/json'}
    data = {"msgtype": "markdown", "markdown": {"content": message}}
    params = {'key': enterprise_wechat_webhook, 'msgtype': 'markdown'}
    if color == "red":
        params['text'] = "@all"
        params['content'] = message.replace("事件告警", "<font color='warning'>事件告警</font>")
    elif color == "green":
        params['text'] = "@all"
        params['content'] = message.replace("告警恢复", "<font color='info'>告警恢复</font>")
    response = requests.post(enterprise_wechat_webhook, headers=headers, params=params, data=json.dumps(data))
    return response.json()

def read_user_names(filepath):
    user_names = {}
    with open(filepath, 'r') as file:
        for line in file:
            ip, name = line.strip().split(' ', 1)  # 按空格分隔，只分割一次
            user_names[ip] = name
    return user_names

user_names_data = read_user_names('/data/network-prometheus/user.name.txt')

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.json
    print("Received data:", data)

    for alert in data.get('alerts', []):
        event_status = alert.get('status', '')
        user_ip = alert.get('labels', {}).get('ip_address', '')
        current_value = alert.get('annotations', {}).get('summary', '').replace("%", "")  # 去除百分号

        trigger_time = alert.get('startsAt', '')
        end_time = alert.get('endsAt', '')

        if event_status == "firing":
            event_status_text = "<font color='warning'>事件告警</font>"
            color = "red"
        elif event_status == "resolved":
            event_status_text = "<font color='info'>告警恢复</font>"
            color = "green"
        else:
            event_status_text = event_status
            color = "info"

        event_name = alert.get('labels', {}).get('alertname', '')  # 获取警报名称

        if user_ip in user_names_data:
            name = user_names_data[user_ip]
            message = f"### 事件状态: {event_status_text}\n\n事件名称: {event_name}\n用户IP: {user_ip}\n当前数值: {current_value}\n使用人: {name}\n触发时间: {trigger_time}\n结束时间: {end_time}"
        else:
            message = f"### 事件状态: {event_status_text}\n\n事件名称: {event_name}\n用户IP: {user_ip}\n当前数值: {current_value}\n触发时间: {trigger_time}\n结束时间: {end_time}"

        response = send_message_to_enterprise_wechat(message, color=color)

    return jsonify(response)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8081)


```

