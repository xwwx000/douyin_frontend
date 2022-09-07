import React, { useEffect, useRef } from 'react'
import { Card, Col, Row, Progress } from 'antd'
import axios from 'axios'
import * as echarts from 'echarts'
export default function Home() {

  const barRef1 = useRef()
  const barRef2 = useRef()
  useEffect(() => {
    // 基于准备好的dom，初始化echarts实例
    var myChart1 = echarts.init(barRef1.current);

    // 指定图表的配置项和数据
    var option1 = {
      title: {
        text: '统计一'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart1.setOption(option1);

    var myChart2 = echarts.init(barRef2.current);
    var option2 = {
      title: {
        text: '统计二'
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
        }
      ]
    };

    myChart2.setOption(option2);
  }, [])
  return (
    <div className="site-card-wrapper">
      <Card title="数据概览" bordered={true}>
        <Row gutter={16}>
          <Col span={6}>
            <div>
              <h3>订单总数(当日)</h3>
            </div>
            <div>
              <h2>0</h2>
            </div>
            <div style={{ padding: "10px 20px" }}>
              <Progress percent={100} showInfo={false} />
            </div>
          </Col>
          <Col span={6}>
            <div>
              <h3>订单总数(当日)</h3>
            </div>
            <div>
              <h2>0</h2>
            </div>
            <div style={{ padding: "10px 20px" }}>
              <Progress percent={100} showInfo={false} />
            </div>
          </Col>
          <Col span={6}>
            <div>
              <h3>订单总数(当日)</h3>
            </div>
            <div>
              <h2>0</h2>
            </div>
            <div style={{ padding: "10px 20px" }}>
              <Progress percent={100} showInfo={false} />
            </div>
          </Col>
          <Col span={6}>
            <div>
              <h3>订单总数(当日)</h3>
            </div>
            <div>
              <h2>0</h2>
            </div>
            <div style={{ padding: "10px 20px" }}>
              <Progress percent={100} showInfo={false} />
            </div>
          </Col>
        </Row>
      </Card>
      <Card title="库存汇总" bordered={true}>
        <Row gutter={16}>
          <Col span={6}>
            <div>
              <h3>订单总数(当日)</h3>
            </div>
            <div>
              <h2>0</h2>
            </div>
          </Col>
          <Col span={6}>
            <div>
              <h3>订单总数(当日)</h3>
            </div>
            <div>
              <h2>0</h2>
            </div>
          </Col>
          <Col span={6}>
            <div>
              <h3>订单总数(当日)</h3>
            </div>
            <div>
              <h2>0</h2>
            </div>
          </Col>
          <Col span={6}>
            <div>
              <h3>订单总数(当日)</h3>
            </div>
            <div>
              <h2>0</h2>
            </div>
          </Col>
        </Row>
      </Card>
      <Card title="统计分析" bordered={true}>
        <Row gutter={16}>
          <Col span={12}>
            <div ref={barRef1} style={{ height: "230px" }}></div>
          </Col>
          <Col span={12}>
            <div ref={barRef2} style={{ height: "230px" }}></div>
          </Col>
        </Row>
      </Card>
    </div>
  )
}
