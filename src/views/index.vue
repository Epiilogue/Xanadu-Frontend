<template>
  <div class="welcome-page">
    <h1 class="title">欢迎使用Xanadu物流管理系统</h1>
    <p>
      Xanadu是一款旨在优化和简化物流运营的综合管理系统，帮助您提升物流效率。
    </p>
    <p>
      我们的系统提供了一系列功能，包括：
    </p>
    <ul>
      <li>订单管理</li>
      <li>库存追踪</li>
      <li>运输调度</li>
      <li>数据分析</li>
      <li>客户管理</li>
      <li>财务报表</li>
    </ul>
    <p>
      借助Xanadu，您可以高效地管理物流流程，提升交货时间，提高客户满意度。
    </p>
    <h2 class="subtitle">技术栈</h2>
    <p>
      Xanadu采用了以下关键技术：
    </p>
    <ul>
      <li>
        <strong>Spring Cloud：</strong> Spring Cloud是一个用于构建分布式系统的开发工具集合，提供了诸多微服务开发所需的功能模块，例如服务注册与发现、负载均衡、服务调用、断路器等。
      </li>
      <li>
        <strong>Nacos：</strong> Nacos是一个动态服务发现、配置和服务管理平台，用于实现微服务架构中的服务注册、配置管理和服务发现等功能。
      </li>
      <li>
        <strong>Redis：</strong> Redis是一个高性能的键值存储系统，常用于缓存、消息队列和分布式会话管理等场景，在Xanadu中用于实现数据缓存和提高系统性能。
      </li>
      <li>
        <strong>Vue2：</strong> Vue2是一个流行的JavaScript框架，用于构建用户界面。它具有简洁的语法、响应式数据绑定和组件化开发等特点，为Xanadu提供了灵活和高效的前端开发能力。
      </li>
      <li>
        <strong>Docker：</strong> Docker是一种容器化平台，可以帮助打包、分发和运行应用程序。在Xanadu中，使用Docker可以实现快速部署和扩展微服务。
      </li>
      <li>
        <strong>消息队列：</strong> 消息队列是一种用于异步通信的技术，可以实现系统间解耦、削峰填谷和提高可靠性。在Xanadu中，消息队列用于处理异步任务和实现系统之间的消息传递。
      </li>
      <li>
        <strong>MybatisPlus：</strong> MybatisPlus是基于MyBatis的增强工具库，提供了许多便捷的功能和增强特性，简化了数据库访问的开发工作。
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'WelcomePage',
}
</script>

<style scoped>
.welcome-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.title {
  font-size: 24px;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 20px;
  margin-top: 30px;
}

ul {
  text-align: left;
  margin: 20px 0;
  padding-left: 20px;
}

.start-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #42b983;
  color: #fff;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.start-button:hover {
  background-color: #36996e;
}
</style>
