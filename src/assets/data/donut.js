data = {
labels: ['USA', 'Canada', 'Brazil', 'Japan', 'Korea', 'Other'],
datasets: [
    {
    label: '% contribution',
    data: [12, 19, 3, 5, 2, 3],
    backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
    ],
    borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
    ],
    borderWidth: 1,
    },
],
};

const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Chart.js Bar Chart',
      },
    },
};
// bar data
barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'US growth',
        data: this.labels.map(() => this.getRandomInt(1000)),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'EU growth',
        data: this.labels.map(() => this.getRandomInt(1000)),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
